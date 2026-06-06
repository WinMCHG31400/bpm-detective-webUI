import detect from '../src/detect.js';

const fileInput = document.getElementById('file');
const detectBtn = document.getElementById('detect');
const playBtn = document.getElementById('play');
const resultDiv = document.getElementById('result');

let audioBuffer = null;
let audioDataUrl = null;

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  detectBtn.disabled = true;
  playBtn.disabled = true;
  resultDiv.textContent = 'Loading…';
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    resultDiv.textContent = 'Loaded, ready to detect.';
    detectBtn.disabled = false;
    playBtn.disabled = false;
    audioDataUrl = URL.createObjectURL(file);
  } catch (err) {
    console.error(err);
    resultDiv.textContent = 'Failed to decode audio: ' + err.message;
  }
});

detectBtn.addEventListener('click', () => {
  if (!audioBuffer) return;
  resultDiv.textContent = 'Detecting…';
  try {
    const bpm = detect(audioBuffer);
    resultDiv.textContent = 'Detected BPM: ' + bpm;
  } catch (err) {
    resultDiv.textContent = 'Failed to detect BPM: ' + err.message;
  }
});

playBtn.addEventListener('click', () => {
  if (!audioDataUrl) return;
  const audio = new Audio(audioDataUrl);
  audio.play();
});
