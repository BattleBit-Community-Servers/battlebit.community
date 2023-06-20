// Function to fetch server list data and update player count
function updatePlayerCount() {
    // Fetch the server list data
    fetch("https://publicapi.battlebit.cloud/Servers/GetServerList")
      .then(response => response.json())
      .then(data => {
        // Calculate the player count
        let playerCount = 0;
        data.forEach(server => {
          playerCount += server.Players;
        });
  
        // Update the player count element
        const playerCountElement = document.getElementById("playerCount");
        playerCountElement.textContent = `Total Players: ${playerCount}`;
      })
      .catch(error => {
        console.error("Error fetching server list:", error);
      });
  }
  
  // Update the player count every second
  setInterval(updatePlayerCount, 1000);
  