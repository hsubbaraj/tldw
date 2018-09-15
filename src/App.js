import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from './actions';

import YouTube from 'react-youtube';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class App extends Component {
  
  submitUrl(){
    if(this.props.youtube_url == ""){
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
        <Button variant="outlined" color="primary" onclick={this.submitUrl.bind(this)}>
          Get GIFS!
        </Button>
        <input type="text" value={this.props.youtube_url} onChange={this.handleChange.bind(this)} />
        <button onclick={this.submitUrl.bind(this)}>Activate Lasers</button>
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
    )
    const y2 = (<p></p>)
    if(this.props.youtube_url == ""){
      return y2;
    }
    else{
      return y1;
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
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
