import { constructUrl, setlocalStorage, getlocalStorage } from "./utils.js";
var redirect_uri = "http://127.0.0.1:5500/index.html";
 

var client_id = ""; 
var client_secret = "";

var access_token = null;
var refresh_token = null;





window.addEventListener("DOMContentLoaded", () =>{
    onPageLoad();
});

window.addEventListener("DOMContentLoaded", () =>{
    const requestbtn = document.getElementById("requestAuthButton");
    requestbtn.addEventListener("click",requestAuthorization);
    


});


function updateUI(access_token){
    if ( access_token == null ){
        document.getElementById("tokenSection").style.display = 'block';  
    }
    else {
        document.getElementById("deviceSection").style.display = 'block';  
        
    }
}

function onPageLoad(){
    client_id =  getlocalStorage("client_id");
    client_secret = getlocalStorage("client_secret");
    if ( window.location.search.length > 0 ){
        handleRedirect();
    }
    else{
        access_token = getlocalStorage("access_token");
        updateUI(access_token);
    }
}

function handleRedirect(){
    let code = getCode();
    exhangeCodeToToken(code);
    window.history.pushState("", "", redirect_uri);
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function requestAuthorization(){
    client_id = document.getElementById("clientId").value;
    client_secret = document.getElementById("clientSecret").value;
    setlocalStorage("client_id", client_id);
    setlocalStorage("client_secret", client_secret); 
    const AUTHORIZE = "https://accounts.spotify.com/authorize"
    const baseUrl = AUTHORIZE;
    const params = new URLSearchParams({
        client_id       : client_id,
        response_type   : "code",
        redirect_uri    : redirect_uri,
        show_dialog     : true,
        scope            : "user-library-read"

    }).toString();
    const url = constructUrl(baseUrl,params);
    window.location.href = url; 
}

function exhangeCodeToToken( code ){   
    const body = new URLSearchParams({
        grant_type : "authorization_code",
        code       : code,
        redirect_uri : redirect_uri,
        client_id   : client_id,
        client_secret : client_secret
    }).toString();
    callAuthorizationApi(body);
}

let refreshAccessToken = function () {
    console.log("refresh called");
    const refresh_token = localStorage.getItem("refresh_token");
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        client_id: client_id
    }).toString();

    callAuthorizationApi(body);
}

async function callAuthorizationApi(body) {
    try {
        const TOKEN = "https://accounts.spotify.com/api/token";
        const response = await fetch(TOKEN, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret)
            },
            body: body
        });

        if (!response.ok) {
            console.error("Authorization API call failed:", response.statusText);
            return;
        }

        const data = await response.json();
        handleAuthorizationResponse(data);
    } catch (error) {
        console.error("Error while calling Authorization API:", error);
    }
}


function handleAuthorizationResponse(data) {
    if (data && data.access_token) {
        console.log(data);

        if (data.access_token !== undefined) {
            access_token = data.access_token;
            setlocalStorage("access_token", access_token);
        }

        if (data.refresh_token !== undefined) {
            refresh_token = data.refresh_token;
            setlocalStorage("refresh_token", refresh_token);
        }

        onPageLoad();
    } else {
        console.log("Authorization failed:", data);
        alert("Authorization failed: " + (data ? data.error_description || 'Unknown error' : 'No data'));
    }
}
















