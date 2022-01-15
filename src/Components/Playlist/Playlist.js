import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

export default class Playlist extends React.Component{
    constructor(props){
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    
    handleNameChange(name){
        this.props.onNameChange(name.target.value);
    }
    
    render(){
        return (
            <div className="Playlist">
                <input defaultValue={this.props.playlistName} onChange={this.handleNameChange}/>
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        )
    }
}