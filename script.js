let video = document.querySelector('video'); // html video element
let constraints = { video: true, audio: true };
let recordBtn = document.querySelector('#record');
let captureBtn = document.querySelector('#capture');
let chunks = [];
let mediaRecorder;
let isRecording = false;

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
    ctx.drawImage(video, 0, 0); // draw that video frame

    // save trick
    let a = document.createElement('a');
    a.download = 'image.jpg';
    a.href = c.toDataURL();
    a.click();
    a.remove();
}