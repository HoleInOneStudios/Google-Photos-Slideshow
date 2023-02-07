const sign = "https://photoslibrary.googleapis.com/";

var client;
var access_token;

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
        body: {

        }
    })
    console.log(result)
    setupAlbumSelector(result.albums)

    return result;
}

async function getAlbumPhotos(array = [], next) {
    let result = await $.ajax({
        url: sign + "v1/mediaItems:search",
        type: "POST",
        headers: {
            Authorization: "Bearer " + access_token
        },
        body: {
            albumId: $('#album_select').val(),
            pageToken: next,
            pageSize: 100
        }
    })
    array = array.concat(result.mediaItems);
    console.log(array, result)

    if (result.nextPageToken) {
        //array = array.concat(await getAlbumPhotos(array, result.nextPageToken))
    }

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