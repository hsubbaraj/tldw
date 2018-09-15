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
    console.log('IM DOING SOMETHING')
    if(this.props.youtube_url === ""){
      alert('Please use a valid youtube link');
    }
    else{
      this.props.actions.getGifs(this.props.youtube_url)
    }
  }

  handleChange(event){
    this.props.actions.updateUrl(event.target.value)
  }

  videoInput(){
    return (
      <div>
        <TextField
          id="name"
          label="YouTube URL"
          value={this.props.youtube_url}
          onChange={this.handleChange.bind(this)}
          margin="normal"
        />
        <br/>
        <Button variant="outlined" color="primary" onClick={this.submitUrl.bind(this)}>
          Get GIFS!
        </Button>
      </div>
    );
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
        <p>{videoid}</p>
        <YouTube
          videoId={videoid}
          opts={opts}
          onReady={this._onReady}
        />
      </div>
    );
    const y2 = (<p></p>);
    const y3 = this.props.gif_urls.map((gif) =>
      <div>
        <iframe src={gif} width="480" height="301" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
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
              TLDR-Videos
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
    youtube_url: state.gifs.youtube_url
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
