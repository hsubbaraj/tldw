import nltk
import operator
import sys
import requests
import os
import pytube
import subprocess
import json
import time
from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route("/urlToGifs", methods=["POST"])
@cross_origin(supports_credentials=True)
def urlToGifs():
    request_json = request.get_json()
    url = request_json[u'url']
    title = getTitle(url) 
    text = title + ".txt"
    if text in os.listdir('.'):
        f = open(text, "r")
        content = f.read()
    else:
        video_path = downloadVideo(url)
        content = get_transcript(video_path)
        f = open(text, "w")
        f.write(content)
        f.close()
    content.replace("\n", " ")
    content.replace("Speaker ", "")

    gifs = []
    # 5 most common nounse from the text
    k1 = getKeyWordsFromText(content, 5)
    print(k1)
    gifs = getGifsFromKeyword(k1, 4)

    # key words from summry
    # k2 = getSmmryKeyWords(content, 5)
    # print(k2)
    # gifs.extend(getGifsFromKeyword(k2, 2))

    print(title)
    gifs.extend(getGifsFromKeyword(title, 2))

    # remove duplicates
    gifs = list(set(gifs))

    # Fill the gifs up with summry keywords
    # summry_gifs = getGifsFromKeyword(k2, 5)
    # for gif in summry_gifs:
    #     if not gif in gifs and len(gifs) < 6:
    #         gifs.append(gif)

    result = {"gifs": gifs, "title": title}
    return json.dumps(result)

def getTitle(youtube_link):
    yt = pytube.YouTube(youtube_link).streams.first()
    name = yt.default_filename  # get default name using pytube API
    return name.replace(".mp4", "")

def get_transcript(filename):
    submit_job = 'curl -X POST "https://api.rev.ai/revspeech/v1beta/jobs" -H "Authorization: Bearer 01Kl4SMaxWvA98J3gzjNvD07TLg5r2b7IRNMbtfLazUS4nT1JOrrMnqQqsEcP1Rhx1ElJmCl73xhuouBH0_86jhp23RKg" -H "Content-Type: multipart/form-data" -F "media=@' + filename + ';type=audio/mp3" -F "options={}"'
    output = subprocess.check_output(submit_job, shell=True).decode()
    job_id = output.split("\"")[3]
    print('waiting on job ' + str(job_id))
    time.sleep(30)

    while query_job(job_id)[0] == '{':
        print('still waiting on job...')
        time.sleep(15)
    return query_job(job_id);

def query_job(job_id):
    url = "https://api.rev.ai/revspeech/v1beta/jobs/" + str(job_id) + "/transcript"

    headers = {
        'Authorization': "Bearer 01Kl4SMaxWvA98J3gzjNvD07TLg5r2b7IRNMbtfLazUS4nT1JOrrMnqQqsEcP1Rhx1ElJmCl73xhuouBH0_86jhp23RKg",
        'Accept': 'text/plain'
    }

    response = requests.request("GET", url, headers=headers)

    return response.text

def getGifsFromKeyword(keyword, num):
    keyword = keyword.replace(" ", "+")
    keyword = keyword[:-1]
    r = requests.get("https://api.giphy.com/v1/gifs/search?api_key=7KbDjZkZAVXQFygXuErU8ukQdg8nGe4a&q=" + str(keyword) + "&limit=" + str(num))
    data = r.json()[u'data']
    res = []
    for d in data:
        res.append(d[u'embed_url'])
    return res

def downloadVideo(youtube_link):
    yt = pytube.YouTube(youtube_link).streams.first()
    default_filename = yt.default_filename  # get default name using pytube API
    yt.download()
    dest_file_name = default_filename.replace(".mp4",".mp3")
    subprocess.call(['ffmpeg', '-i',                # or subprocess.run (Python 3.5+)
        os.path.join(default_filename),
        os.path.join(dest_file_name)
    ])
    return dest_file_name

def getSmmryKeyWords(content, num_key_words):
    data = {'sm_api_input': content}
    r = requests.post("https://api.smmry.com/&SM_API_KEY=C9BBFE4EAC&SM_KEYWORD_COUNT="+str(num_key_words), data=data)
    words = r.json()[u'sm_api_keyword_array']
    result_key_words = ""
    for w in words:
        result_key_words += w + " "
    return result_key_words

def getKeyWordsFromText(content, num_key_words):
    text = nltk.word_tokenize(content)
    words_with_tags = nltk.pos_tag(text)
    noun_to_count = {}
    for w in words_with_tags:
        if 'NN' == w[1]:
            if not w[0] in noun_to_count:
                noun_to_count[w[0]] = 1
            else:
                noun_to_count[w[0]] += 1

    noun_to_count_list = []
    for (k,v) in noun_to_count.items():
        noun_to_count_list.append((k, v))

    noun_to_count_list = sorted(noun_to_count_list, key=lambda x: x[1])
    noun_to_count_list.reverse()
    
    result_key_words = ""
    for i in range(num_key_words):
        result_key_words += noun_to_count_list[i][0] + " "
    return result_key_words
