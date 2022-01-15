
let accessToken;
const clientID = '';
const redirectURI = 'http://localhost:3000';

const Spotify = {

    getAccessToken(){ // This is based on the reponse from the Spotify site, which is a repsonse URL which you have to parse and grab the access token.
        if(accessToken){
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);//Parsing our response url to access a token
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/); //parsing our response url to grab an expiration time.

        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1]; 
            const expiresIn = Number(expiresInMatch[1]);
            
            window.setTimeout(() => accessToken = '', expiresIn * 1000);//Clears the parameters, allowingus to grab a new access code when it expires.
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }
        else{
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }

    },
    search(term){
        const accessToken = Spotify.getAccessToken();//run our method to get our access token
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { // the specific Spotify endpoint for search results. We are using fetch for this, but there are multpile ways to grab info.
            headers: {Authorization: `Bearer ${accessToken}`} //this is the header to the request to the Spotify API. Header/Body. similar to an HTML file (header, body)
          }).then(response => {
              return response.json();//convert our response to json
            }).then(jsonRepsonse => {
                if(!jsonRepsonse.tracks){ //then check if our json response has the property of tracks, if not, empty list
                    return [];
                }
                return jsonRepsonse.tracks.items.map(track => ({ 
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }))
            })

    },

    savePlaylist(name, trackUris){
        if(!name || !trackUris.length){//first check if there is a playlist. So check for a name and a playlist length.
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userID;
        return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => response.json()).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch (`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify( {name: name} )
            }
        )}).then(response => response.json()).then(jsonRepsonse => {
            let playListId = jsonRepsonse.id
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playListId}/tracks`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({uris: trackUris})
            }).then(response => response.json()).then(jsonResponse => {
                playListId = jsonResponse.id
            })
        })

    }
};


export default Spotify;