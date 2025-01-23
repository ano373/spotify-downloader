const TRACKS = "https://api.spotify.com/v1/me/tracks";



 window.addEventListener("DOMContentLoaded", () =>{

    const fetchtrackbtn = document.getElementById("fetchTracksButton");
    fetchtrackbtn.addEventListener("click",() => {
        const access_token = localStorage.getItem("access_token");
        offset = document.getElementById("offset").value;
        limit = document.getElementById("limit").value;

        fetchTracks(TRACKS,access_token,limit,offset)
       
    });
    
 });


function constructUrl(baseUrl, queryParams) {
    const urlObj = new URL(baseUrl);
    const params = new URLSearchParams(queryParams);
    urlObj.search = params.toString();
    return urlObj.toString();
}

async function makeRequest(url, options) {
    const response = await fetch(url, options);
    return response;
}

async function fetchTracks(baseUrl, access_token, limit, offset) {
    const queryParams = { limit, offset };
    const url = constructUrl(baseUrl, queryParams);
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    };

    const response = await makeRequest(url, options);
    await handleApiResponse(response,url,options)
    
        
    
}
function extractSongInfo(json){
    let songsInfo = [];
        for (let item of json['items']) {
            let songInfo = {
                "track name" : item.track.name,
                "album"      : item.track.album.name,
                "artists"    : item.track.artists.map(artist => artist.name).join(' '), 
                "duration_ms" : item.track.duration_ms
            };
        songsInfo.push(songInfo);
        }
        console.log(songsInfo);

}

const statusHandlers = {
    200 : async (response) => {
        console.log("Success");
        const json = await response.json();
        extractSongInfo(json);
    } ,
    400: (response) => {console.log("Bad request:", response);
        refreshAccessToken();
    },
    401: async (response) => {
        await refreshAccessToken();
        retryRequest();
    },
    default: (response) => console.log("Error:", response),
};

async function handleApiResponse(response) {
    const handler = statusHandlers[response.status] || statusHandlers.default;
    await handler(response);
}



