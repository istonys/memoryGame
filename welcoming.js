document.addEventListener("DOMContentLoaded", function () {
  const startGameBtn = document.getElementById("startGameBtn");

  startGameBtn.addEventListener("click", function () {
    const usernameInput = document.getElementById("usernameInput");
    const username = usernameInput.value.trim();

    if (username !== "") {
      let players = [];

      const storedPlayers = localStorage.getItem("players");
      if (storedPlayers) {
        players = JSON.parse(storedPlayers);
      }

      const existingPlayer = players.find(
        (player) => player.username === username
      );

      if (existingPlayer) {
        sessionStorage.setItem("currentPlayer", JSON.stringify(existingPlayer));
      } else {
        const newPlayer = {
          username: username,
          score: 0,
        };
        players.push(newPlayer);
        localStorage.setItem("players", JSON.stringify(players));
        sessionStorage.setItem("currentPlayer", JSON.stringify(newPlayer));
      }

      window.location.href = "index.html";
    } else {
      alert("Please enter a valid username to start the game.");
    }
  });
});
