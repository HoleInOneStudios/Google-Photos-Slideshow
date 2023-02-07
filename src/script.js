const sign = "https://photoslibrary.googleapis.com/";

var client;
var access_token;

var album_list = [];
var photosList = [];

let img = $('#image');

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
        array = array.concat(await getAlbumPhotos(array, result.nextPageToken))
    }

    photosList = array;
    return array;
}

function setupAlbumSelector(list = []) {
    let selector = $('#album_select');
    console.log(selector)

    for (let i = 0; i < list.length; i++) {
        let option = $('<option>');
        option.val(list[i].id);
        option.text(list[i].title);
        selector.append(option);
    }
}