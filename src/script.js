const sign = "https://photoslibrary.googleapis.com/";

var client;
var access_token;

var album_list = [];
var photosList = [];

let img = $('#image');
let imageDurationSeconds = 3;

let mode = {
    random: 0,
    sequential: 1,
}
let currentMode = mode.random;

// Google Logic

function initClient() {
    client = google.accounts.oauth2.initTokenClient({
        client_id: '757214006943-k1h2o1raq2nhc7p742ll84ekb36jdhmn.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.sharing',
        callback: (tokenResponse) => {
            access_token = tokenResponse.access_token;
            console.log(access_token);

            getAlbumList();
        },
    })
}

function getToken() {
    client.requestAccessToken();
}

async function getAlbumList() {
    let result = await $.ajax({
        url: sign + "v1/albums",
        type: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        data: {

        }
    })
    //console.log(result)
    album_list = result.albums;
    setupAlbumSelector(result.albums)

    return result;
}

async function getAlbumPhotos(array = [], next) {
    //console.log($('#album_select').val())
    let result = await $.ajax({
        url: sign + "v1/mediaItems:search",
        type: "POST",
        headers: {
            Authorization: "Bearer " + access_token
        },
        data: {
            pageSize: 100,
            albumId: $('#album_select').val(),
            pageToken: next,
        }
    })
    //console.log(result)
    array = array.concat(result.mediaItems)
    if (result.nextPageToken) {
        array = array.concat(getAlbumPhotos(array, result.nextPageToken))
    }

    photosList = array;
    return array;
}

function setupAlbumSelector(list = []) {
    let selector = $('#album_select');
    //console.log(selector)
    for (let i = 0; i < list.length; i++) {
        let option = $('<option>');
        option.val(list[i].id);
        option.text(list[i].title);
        selector.append(option);
    }
}

// Slideshow Logic

var currentPhoto = 0;

async function nextPhoto() {
    currentPhoto++;
    if (currentPhoto >= photosList.length) {
        currentPhoto = 0;
    }
    await updatePhoto();
}

async function randomPhoto() {
    currentPhoto = Math.floor(Math.random() * photosList.length);
    await updatePhoto();
}

async function updatePhoto() {
    if (photosList[currentPhoto]) {
        await img.attr('src', photosList[currentPhoto].baseUrl);
        console.log(photosList[currentPhoto].baseUrl)
    }
}

function setMode() {
    currentMode = mode[$('#mode_select').val()] ? mode[$('#mode_select').val()] : mode.sequential;
}

function loop() {
    if (currentMode == mode.sequential) {
        nextPhoto();
    } else if (currentMode == mode.random) {
        randomPhoto();
    }
    console.log(currentPhoto)

    setTimeout(loop, imageDurationSeconds * 1000);
}
loop();

function setSpeed() {
    imageDurationSeconds = $('#slideshow_speed').val();
    console.log(imageDurationSeconds)
}