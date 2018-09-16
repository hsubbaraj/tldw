import React, { Component } from 'react';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from './actions';

import YouTube from 'react-youtube';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class App extends Component {
  
  submitUrl(){
    console.log('IM DOING SOMETHING');
    if(this.props.youtube_url === ""){
      alert('Please use a valid youtube link');
    }
    else{
      this.props.actions.submit();
      this.props.actions.getGifs(this.props.youtube_url);
    }
  }

  handleChange(event){
    this.props.actions.updateUrl(event.target.value);
  }

  buttonRender() {
    if(this.props.submitted){
      console.log("FUCK");
      return (<img src="spinner.gif" id="spinner"></img>);
    }
    console.log("QUEME");
    return (
      <Button variant="outlined" color="primary" onClick={this.submitUrl.bind(this)}>
        Get GIFS!
      </Button>
    );
  }

  videoInput(){
    console.log(this.props.done)
    if (!this.props.done) {
      return (
        <div>
           <Typography variant="display2" gutterBottom>
            TOO LONG; DIDN'T WATCH
          </Typography>
          <Typography variant="headline" gutterBottom>
            Enter a YouTube link to get started!
          </Typography>
          <TextField
            id="name"
            label="YouTube URL"
            value={this.props.youtube_url}
            onChange={this.handleChange.bind(this)}
            margin="normal"
          />
          <br/>
          {this.buttonRender()}
        </div>
      );
    }
    return (
      <div>
        <Typography variant="display2" gutterBottom>
          TOO LONG; DIDN'T WATCH
        </Typography>
        <Typography variant="headline" gutterBottom>
          {this.props.title}
        </Typography>
      </div>
    )
  }

  displayVideo(){
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    let id_index = this.props.youtube_url.indexOf("=")
    var videoid = this.props.youtube_url.substring(id_index+1, this.props.youtube_url.length)
    const y1 = (
      <div>
        <YouTube
          videoId={videoid}
          opts={opts}
          onReady={this._onReady}
        />
      </div>
    );
    const y2 = (<p></p>);
    const y3 = (
      <div>
        <div>
          <iframe src={this.props.gif_urls[0]} width="480" height="301" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
          <iframe src={this.props.gif_urls[1]} width="480" height="301" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
          <iframe src={this.props.gif_urls[2]} width="480" height="301" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
        </div>
        <div>
          <iframe src={this.props.gif_urls[3]} width="480" height="301" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
          <iframe src={this.props.gif_urls[4]} width="480" height="301" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
          <iframe src={this.props.gif_urls[5]} width="480" height="301" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
        </div>
      </div>
    );
    if(this.props.gif_urls.length !== 0){
      return y3;
    }
    else if(this.props.youtube_url !== ""){
      return y1;
    }
    else{
      return y2;
    }
  }

  render() {
    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            
            <Typography variant="title" color="inherit">
              TL;DW
            </Typography>
            
          </Toolbar>
        </AppBar>
        <p className="App-intro">
          {this.videoInput()}
        </p>
        <p>
          {this.displayVideo()}
        </p>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    gif_urls: state.gifs.gif_urls,
    youtube_url: state.gifs.youtube_url,
    submitted: state.gifs.submitted,
    title: state.gifs.title,
    done: state.gifs.done,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
