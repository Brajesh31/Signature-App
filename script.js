const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let painting = false;
let undoStack = [];

const startPosition = (e) => {
    painting = true;
    draw(e);
};

const finishedPosition = () => {
    painting = false;
    ctx.beginPath();
};

const draw = (e) => {
    if (!painting) return; // Only draw when the mouse is pressed down
    ctx.lineWidth = document.getElementById('fontSize').value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = document.getElementById('textColor').value;

    // Draw line
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
};

const saveState = () => {
    undoStack.push(canvas.toDataURL());
};

const undo = () => {
    if (undoStack.length > 0) {
        const previousState = undoStack.pop();
        const img = new Image();
        img.src = previousState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
};

// Mouse events
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', finishedPosition); // Stop drawing when leaving canvas
canvas.addEventListener('mouseenter', () => {
    if (painting) {
        draw(event); // Draw if painting is true when mouse enters
    }
});
canvas.addEventListener('mousedown', saveState);

// Button events
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('saveBtn').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.png';
    link.click();
});

document.getElementById('retrieveBtn').addEventListener('click', () => {
    const savedImage = localStorage.getItem('savedSignature');
    if (savedImage) {
        const img = new Image();
        img.src = savedImage;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
    } else {
        alert('No saved signature found!');
    }
});

document.getElementById('undoBtn').addEventListener('click', undo);

// Change canvas background color
document.getElementById('canvasBgColor').addEventListener('change', (e) => {
    canvas.style.backgroundColor = e.target.value;
});
