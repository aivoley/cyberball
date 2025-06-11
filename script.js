const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const timerEl = document.getElementById("timer");
const nameInput = document.getElementById("name");

let playerId = "Player1";
let currentHolder = "Player1";
const players = ["Player1", "Player2", "Player3", "Player4", "Player5", "Player6"];
let customNames = [...players];
let ostr = [];
let timer = 60;
let timerInterval;

const pos = [
  {x:150,y:150},{x:400,y:100},{x:650,y:150},
  {x:150,y:450},{x:400,y:500},{x:650,y:450}
];

function draw() {
  ctx.clearRect(0,0,800,600);
  players.forEach((p,i)=>{
    if (ostr.includes(p)) return;
    ctx.beginPath();
    ctx.arc(pos[i].x, pos[i].y, 40, 0, 2 * Math.PI);
    ctx.fillStyle = (p === currentHolder) ? "orange" : "lightgray";
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(customNames[i], pos[i].x - 30, pos[i].y + 5);
  });
}

function passTo(to) {
  if (currentHolder !== playerId || ostr.includes(to)) return;
  currentHolder = to;
  draw();
}

canvas.addEventListener("click", e => {
  const x = e.offsetX, y = e.offsetY;
  players.forEach((p, i) => {
    if (ostr.includes(p)) return;
    const dx = x - pos[i].x, dy = y - pos[i].y;
    if (Math.hypot(dx, dy) < 40) passTo(p);
  });
});

function startGame() {
  const name = nameInput.value.trim();
  if (!name) return alert("Ingresá tu nombre primero");
  playerId = players[0]; // default: siempre comienza Player1
  customNames[0] = name;
  draw();
  startTimer();
  setTimeout(() => {
    ostr = ["Player3", "Player5"];
    draw();
  }, 10000);
}

function startTimer() {
  timer = 60;
  timerEl.textContent = `Tiempo: ${timer}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer--;
    timerEl.textContent = `Tiempo: ${timer}s`;
    if (timer <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = "Fin del juego";
    }
  }, 1000);
}

function resetGame() {
  clearInterval(timerInterval);
  ostr = [];
  currentHolder = "Player1";
  customNames = [...players];
  timerEl.textContent = "Tiempo: 60s";
  draw();
}
