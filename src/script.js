let image = document.getElementById('image');
let image_index = 0;
let images = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
];

let interval = 1000;

let show_mode = {
    random: 0,
    next: 1
}
let mode = show_mode.random;

function nextImage() {
    image_index++;
    if (image_index >= images.length) {
        image_index = 0;
    }
    setImage()
}

function randomImage() {
    image_index = Math.floor(Math.random() * images.length);
    setImage();
}

function setImage() {
    image.src = images[image_index];
    image.alt = images[image_index];
}

function start() {
    return setInterval(() => {
        if (mode == show_mode.random) {
            randomImage();
        }
        else if (mode == show_mode.next) {
            nextImage();
        }
    }, interval);
}