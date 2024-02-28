document.addEventListener("DOMContentLoaded", function () {
  const playersData = JSON.parse(localStorage.getItem("players")) || [];
  const endGameBtn = document.getElementById("endGameBtn");
  let clickedSquare = null;
  let preventClick = true;
  let combosFound = 0;
  const colors = [
    "purple",
    "yellow",
    "red",
    "cyan",
    "blue",
    "teal",
    "orange",
    "green",
    "magenta",
    "black",
  ];

  let timer;
  let timeLeft = 60;

  let gameStarted = false;

  function updateLeaderboard() {
    const sortedPlayers = playersData.sort((a, b) => b.score - a.score);
    const topPlayers = sortedPlayers.slice(0, 15);

    const leaderboardElement = document.getElementById("leaderboard");
    leaderboardElement.innerHTML = "";

    const leaderboardTable = document.createElement("table");
    leaderboardTable.classList.add("leaderboard-table");

    const tableHeader = document.createElement("tr");
    tableHeader.innerHTML = "<th>Rank</th><th>Username</th><th>Score</th>";
    leaderboardTable.appendChild(tableHeader);

    topPlayers.forEach((player, index) => {
      const playerRow = document.createElement("tr");
      playerRow.innerHTML = `
        <td>${index + 1}</td>
        <td>${player.username}</td>
        <td>${player.score}</td>
      `;
      leaderboardTable.appendChild(playerRow);
    });

    leaderboardElement.appendChild(leaderboardTable);
  }

  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      document.getElementById("timer").textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        handleGameEnd();
      }
    }, 1000);
  }

  function endGame() {
    const storedPlayerData = sessionStorage.getItem("currentPlayer");

    if (storedPlayerData) {
      const player = JSON.parse(storedPlayerData);
      const currentScore = player.score || 0;

      const existingPlayerIndex = playersData.findIndex(
        (p) => p.username === player.username
      );

      if (existingPlayerIndex !== -1) {
        if (currentScore > playersData[existingPlayerIndex].score) {
          playersData[existingPlayerIndex].score = currentScore;
        }
      } else {
        playersData.push({
          username: player.username,
          score: currentScore,
        });
      }

      localStorage.setItem("players", JSON.stringify(playersData));
      updateLeaderboard();
      resetGame();
    }
  }

  function handleGameEnd() {
    if (combosFound === 8 && timeLeft > 0) {
      const squares = document.querySelectorAll(".stulpelis");
      squares.forEach((square) => {
        square.className = "stulpelis color-hidden";
        square.removeAttribute("data-color");
      });
      gameStarted = false;
      setTimeout(() => {
        initializeGame();
      }, 500);
    } else {
      const storedPlayerData = sessionStorage.getItem("currentPlayer");
      if (storedPlayerData) {
        const player = JSON.parse(storedPlayerData);
        const currentScore = player.score || 0;
        const existingPlayerIndex = playersData.findIndex(
          (p) => p.username === player.username
        );

        if (existingPlayerIndex !== -1) {
          if (currentScore > playersData[existingPlayerIndex].score) {
            playersData[existingPlayerIndex].score = currentScore;
          }
        } else {
          playersData.push({
            username: player.username,
            score: currentScore,
          });
        }

        localStorage.setItem("players", JSON.stringify(playersData));
        updateLeaderboard();

        resetGame();
      }

      alert("Game Over!");
    }
  }

  function resetGame() {
    clearInterval(timer);
    timeLeft = 60;
    document.getElementById("timer").textContent = timeLeft;
    preventClick = true;
    clickedSquare = null;
    combosFound = 0;
    gameStarted = false;

    const storedPlayerData = sessionStorage.getItem("currentPlayer");
    if (storedPlayerData) {
      const player = JSON.parse(storedPlayerData);
      player.score = 0;
      sessionStorage.setItem("currentPlayer", JSON.stringify(player));

      const scoreElement = document.getElementById("playerScore");
      if (scoreElement) {
        scoreElement.textContent = `Score: ${player.score}`;
      }
    }
    const squares = document.querySelectorAll(".stulpelis");
    squares.forEach((square) => {
      square.className = "stulpelis color-hidden";
      square.removeAttribute("data-color");
    });
  }

  function updatePlayerInfo() {
    const storedPlayerData = sessionStorage.getItem("currentPlayer");

    if (storedPlayerData) {
      const player = JSON.parse(storedPlayerData);
      const currentPlayerElement = document.getElementById("playerName");
      const scoreElement = document.getElementById("playerScore");

      if (currentPlayerElement && scoreElement) {
        currentPlayerElement.textContent = `Current player: ${player.username}`;
        scoreElement.textContent = `Score: ${player.score}`;
      }
    }
  }

  function initializeGame() {
    if (gameStarted) return;

    const cols = [...document.querySelectorAll(".stulpelis")];
    for (let color of colors) {
      const colAIndex = parseInt(Math.random() * cols.length);
      const colA = cols[colAIndex];
      cols.splice(colAIndex, 1);
      colA.className += ` ${color}`;
      colA.setAttribute("data-color", color);

      const colBIndex = parseInt(Math.random() * cols.length);
      const colB = cols[colBIndex];
      cols.splice(colBIndex, 1);
      colB.className += ` ${color}`;
      colB.setAttribute("data-color", color);
    }

    document.querySelectorAll(".stulpelis").forEach((item) => {
      item.addEventListener("click", onColClicked);
    });

    gameStarted = true;
  }

  function onColClicked(e) {
    const target = e.currentTarget;

    if (preventClick || target.className.includes("done")) {
      return;
    }

    target.className = target.className.replace("color-hidden", "").trim();
    target.className += " done";

    if (!clickedSquare) {
      clickedSquare = target;
    } else if (clickedSquare) {
      if (
        clickedSquare.getAttribute("data-color") !==
        target.getAttribute("data-color")
      ) {
        preventClick = true;
        setTimeout(() => {
          clickedSquare.className = clickedSquare.className.replace(
            "done",
            "color-hidden"
          );
          target.className = target.className.replace("done", "color-hidden");

          clickedSquare = null;
          preventClick = false;
        }, 500);
      } else {
        combosFound++;
        target.className += " finished";
        clickedSquare.className += " finished";
        clickedSquare = null;

        const storedPlayerData = sessionStorage.getItem("currentPlayer");
        if (storedPlayerData) {
          const player = JSON.parse(storedPlayerData);
          player.score += 1 + 2 * 4;
          sessionStorage.setItem("currentPlayer", JSON.stringify(player));

          updatePlayerInfo();
        }

        timeLeft += 2;

        if (combosFound === 8) {
          handleGameEnd();
          combosFound = 0;
        }
      }
    }
  }

  function startGame() {
    if (!gameStarted) {
      resetGame();
      initialize();
      initializeGame();
      startTimer();
      gameStarted = true;
      preventClick = false;
    }
  }

  function initialize() {
    const storedPlayerData = sessionStorage.getItem("currentPlayer");

    if (!storedPlayerData) {
      const initialPlayer = {
        username: "Player Name",
        score: 0,
      };
      sessionStorage.setItem("currentPlayer", JSON.stringify(initialPlayer));
    }

    updatePlayerInfo();
    const startGameBtn = document.getElementById("startGameBtn");
    startGameBtn.addEventListener("click", startGame);

    const resetGameBtn = document.getElementById("resetGameBtn");
    resetGameBtn.addEventListener("click", resetGame);
  }

  initialize();
  updateLeaderboard();

  const myIcon = document.getElementById("myIcon");
  myIcon.addEventListener("click", function () {
    window.location.href = "welcoming.html";
  });

  endGameBtn.addEventListener("click", endGame);
});
