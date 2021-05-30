let video = document.querySelector('video'); // html video element
let constraints = { video: true, audio: true };
let recordBtn = document.querySelector('#record');
let captureBtn = document.querySelector('#capture');
let chunks = [];
let mediaRecorder;
let isRecording = false;

// variables for handling filter change
let body = document.querySelector('body');
let filters = document.querySelectorAll('.filter');
let filter = ''; // what filter is selected

// variables for handling zoom
let minZoom = 1;
let maxZoom = 3;
let currZoom = 1;
let zoomIn = document.querySelector('.zoom-in');
let zoomOut = document.querySelector('.zoom-out');

for(let i = 0; i < filters.length; i++)
{
    filters[i].addEventListener('click', function(e) {
        filter = e.currentTarget.style.backgroundColor;
        removeFilter();
        applyFilter(filter);
    });
}

zoomIn.addEventListener('click', function() {
    if(currZoom < maxZoom)
    {
        currZoom += 0.1;
        video.style.transform = `scale(${currZoom})`;
    }
});

zoomOut.addEventListener('click', function() {
    if(currZoom > minZoom)
    {
        currZoom -= 0.1;
        video.style.transform = `scale(${currZoom})`;
    }
});

captureBtn.addEventListener('click', function() {
    capture();

    document.querySelector('.capture-bubble').classList.add('scale-animation');
    
    // remove property from css
    setTimeout(function() {
        document.querySelector('.capture-bubble').classList.remove('scale-animation');
    }, 500);
});

// toggle Recording
recordBtn.addEventListener('click', function() {
    if(isRecording)
    {
        mediaRecorder.stop();
        isRecording = false;
        document.querySelector('.record-bubble').classList.remove('fader-animation');
    }
    else 
    {
        mediaRecorder.start();
        isRecording = true;
        currZoom = 1;
        video.style.transform = `scale(${currZoom})`;
        document.querySelector('.record-bubble').classList.add('fader-animation');
    }
});

// using navigator object provided by Browser
navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(mediaStream) {
        video.srcObject = mediaStream; // mediaStream object having both audio & video
        // let options = { mimeType: 'video/webm; codecs=vp9' };
        
        mediaRecorder = new MediaRecorder(mediaStream);
        
        mediaRecorder.addEventListener('dataavailable', function(e) {
            chunks.push(e.data);
        });

        mediaRecorder.addEventListener('stop', function() {
            let blob = new Blob(chunks, { type: 'video/mp4' }); // very large file is blob

            chunks = [];
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.download = 'video.mp4';
            a.href = url;
            a.click();
            a.remove();
        });
    });

function capture() { // click picture 
    let c = document.createElement('canvas');
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    let ctx = c.getContext('2d');

    // for scaling canvas, we need to shift origin and then back
    ctx.translate(c.width / 2, c.height / 2);
    ctx.scale(currZoom, currZoom);
    ctx.translate(-c.width / 2, -c.height / 2);

    ctx.drawImage(video, 0, 0); // draw that video frame

    // save trick
    let a = document.createElement('a');
    a.download = 'image.jpg';
    a.href = c.toDataURL();
    a.click();
    a.remove();
}

function applyFilter(filterColor) {
    let filterDiv = document.createElement('div');
    filterDiv.classList.add('filter-div');
    filterDiv.style.backgroundColor = filterColor;
    body.appendChild(filterDiv);
}

function removeFilter() {
    let filterDiv = document.querySelector('.filter-div');
    if(filterDiv) filterDiv.remove(); // if it is overlayed then remove the prev
}