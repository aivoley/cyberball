const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const timerEl = document.getElementById("timer");

let playerId = prompt("Enter your name (Player1 to Player6):") || "Player1";
let currentBallHolder = "Player1";
let ostracizedPlayers = [];
const players = ["Player1", "Player2", "Player3", "Player4", "Player5", "Player6"];
const positions = [
  { x: 150, y: 150 },
  { x: 400, y: 100 },
  { x: 650, y: 150 },
  { x: 150, y: 450 },
  { x: 400, y: 500 },
  { x: 650, y: 450 }
];

function drawPlayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  players.forEach((player, i) => {
    if (ostracizedPlayers.includes(player)) return;
    ctx.beginPath();
    ctx.arc(positions[i].x, positions[i].y, 40, 0, 2 * Math.PI);
    ctx.fillStyle = player === currentBallHolder ? "orange" : "lightgray";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(player, positions[i].x - 30, positions[i].y + 5);
  });
}

function passBall(toPlayer) {
  if (currentBallHolder !== playerId || ostracizedPlayers.includes(toPlayer)) return;
  const timestamp = new Date().toISOString();
  db.collection("game").doc("state").set({ holder: toPlayer });
  db.collection("passes").add({ from: playerId, to: toPlayer, time: timestamp });
}

function listenForChanges() {
  db.collection("game").doc("state").onSnapshot(doc => {
    if (doc.exists) {
      currentBallHolder = doc.data().holder;
      drawPlayers();
    }
  });
}

function startOstracism(excludeList) {
  ostracizedPlayers = excludeList;
  drawPlayers();
}

function handleClick(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  players.forEach((player, i) => {
    if (ostracizedPlayers.includes(player)) return;
    const dx = x - positions[i].x;
    const dy = y - positions[i].y;
    if (Math.sqrt(dx * dx + dy * dy) < 40) {
      passBall(player);
    }
  });
}

function startTimer() {
  let timeLeft = 60;
  const interval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(interval);
      canvas.removeEventListener("click", handleClick);
      timerEl.textContent = "Game Over";
    }
  }, 1000);
}

canvas.addEventListener("click", handleClick);

listenForChanges();
drawPlayers();
startTimer();

// Ejemplo de ostracismo a los 10 segundos
setTimeout(() => {
  startOstracism(["Player3", "Player5"]);
}, 10000);
