const video = document.getElementById("video");
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

const cursor = document.getElementById("cursor");

const statusText = document.getElementById("statusText");
const statusDot = document.getElementById("statusDot");

const clearBtn = document.getElementById("clearBtn");
const undoBtn = document.getElementById("undoBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const penSize = document.getElementById("penSize");
const sizeValue = document.getElementById("sizeValue");

let currentColor = "#00ffcc";
let currentSize = 6;

let drawing = false;

let lastX = null;
let lastY = null;

let history = [];


/* =========================
   CANVAS SIZE
========================= */

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const oldCanvas = document.createElement("canvas");

    oldCanvas.width = canvas.width;
    oldCanvas.height = canvas.height;

    const oldCtx = oldCanvas.getContext("2d");

    if (canvas.width > 0 && canvas.height > 0) {
        oldCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = rect.width;
    canvas.height = rect.height;

    if (oldCanvas.width > 0 && oldCanvas.height > 0) {
        ctx.drawImage(
            oldCanvas,
            0,
            0,
            oldCanvas.width,
            oldCanvas.height,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}

window.addEventListener("resize", resizeCanvas);


/* =========================
   COLOR
========================= */

document.querySelectorAll(".color").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".color")
            .forEach(b => b.classList.remove("active"));

        button.classList.add("active");

        currentColor = button.dataset.color;
    });

});


/* =========================
   PEN SIZE
========================= */

penSize.addEventListener("input", () => {

    currentSize = Number(penSize.value);

    sizeValue.textContent = currentSize;

});


/* =========================
   DRAW
========================= */

function draw(x, y) {

    if (lastX === null || lastY === null) {

        lastX = x;
        lastY = y;

        return;
    }

    ctx.beginPath();

    ctx.moveTo(lastX, lastY);

    ctx.lineTo(x, y);

    ctx.strokeStyle = currentColor;

    ctx.lineWidth = currentSize;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.shadowBlur = 8;
    ctx.shadowColor = currentColor;

    ctx.stroke();

    ctx.shadowBlur = 0;

    lastX = x;
    lastY = y;
}


/* =========================
   CLEAR
========================= */

clearBtn.addEventListener("click", () => {

    history.push(
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        )
    );

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    lastX = null;
    lastY = null;

});


/* =========================
   UNDO
========================= */

undoBtn.addEventListener("click", () => {

    if (history.length === 0) return;

    const previous = history.pop();

    ctx.putImageData(previous, 0, 0);

});


/* =========================
   FULLSCREEN
========================= */

fullscreenBtn.addEventListener("click", () => {

    const container =
        document.querySelector(".camera-container");

    if (!document.fullscreenElement) {

        container.requestFullscreen();

    } else {

        document.exitFullscreen();

    }

});


/* =========================
   MEDIAPIPE HANDS
========================= */

const hands = new Hands({
    locateFile: (file) => {

        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;

    }
});


hands.setOptions({

    maxNumHands: 1,

    modelComplexity: 1,

    minDetectionConfidence: 0.6,

    minTrackingConfidence: 0.6

});


/* =========================
   HAND RESULTS
========================= */

hands.onResults(results => {

    if (!results.multiHandLandmarks ||
        results.multiHandLandmarks.length === 0) {

        cursor.style.display = "none";

        drawing = false;

        lastX = null;
        lastY = null;

        statusText.textContent = "Show your hand";

        statusDot.style.background = "orange";

        return;
    }


    statusText.textContent = "Hand Detected";

    statusDot.style.background = "#00ff88";


    const landmarks =
        results.multiHandLandmarks[0];


    /*
        INDEX FINGER TIP
        Landmark 8
    */

    const indexTip = landmarks[8];

    /*
        INDEX FINGER PIP
        Landmark 6
    */

    const indexPip = landmarks[6];


    /*
        MIDDLE FINGER TIP
        Landmark 12
    */

    const middleTip = landmarks[12];

    /*
        MIDDLE FINGER PIP
        Landmark 10
    */

    const middlePip = landmarks[10];


    /*
        Check if index finger is up
    */

    const indexUp =
        indexTip.y < indexPip.y;


    /*
        Check if middle finger is up
    */

    const middleUp =
        middleTip.y < middlePip.y;


    /*
        INDEX FINGER IS THE PEN

        Index up + middle down
        = drawing
    */

    if (indexUp && !middleUp) {

        drawing = true;

    } else {

        drawing = false;

        lastX = null;
        lastY = null;

    }


    /*
        Convert MediaPipe coordinates
        into screen coordinates.

        X is mirrored because
        camera is mirrored.
    */

    const container =
        document.querySelector(".camera-container");

    const width = container.clientWidth;
    const height = container.clientHeight;

    const x =
        (1 - indexTip.x) * width;

    const y =
        indexTip.y * height;


    /*
        Move cursor
    */

    cursor.style.display = "block";

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;


    /*
        Change cursor appearance
    */

    if (drawing) {

        cursor.style.background = currentColor;

        cursor.style.boxShadow =
            `0 0 10px ${currentColor},
             0 0 25px ${currentColor}`;

        draw(x, y);

    } else {

        cursor.style.background = "#ffffff";

        cursor.style.boxShadow =
            "0 0 10px white";

    }

});


/* =========================
   CAMERA
========================= */

const camera = new Camera(video, {

    onFrame: async () => {

        await hands.send({
            image: video
        });

    },

    width: 1280,

    height: 720

});


/* =========================
   START
========================= */

async function startCamera() {

    try {

        await camera.start();

        statusText.textContent =
            "Camera Active";

        statusDot.style.background =
            "#00ff88";

        resizeCanvas();

    } catch (error) {

        console.error(error);

        statusText.textContent =
            "Camera Permission Required";

        statusDot.style.background =
            "red";

        alert(
            "Camera access allow karo aur page ko dobara reload karo."
        );

    }

}


startCamera();