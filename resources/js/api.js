let serversData = [];
let sortKey = '';
let sortOrder = 'asc';
let showOfficialServers = true;
let showCommunityServers = true;
let sizeFilter = '';

const sortServersBy = (key) => {
  if (sortKey === key) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey = key;
    sortOrder = 'asc';
  }

  const serverList = document.getElementById('serverList');
  serverList.innerHTML = '';

  const filteredData = serversData.filter(server => {
    if (!showOfficialServers && server.IsOfficial) {
      return false;
    }
    if (!showCommunityServers && !server.IsOfficial) {
      return false;
    }
    if (sizeFilter && server.MaxPlayers.toString() !== sizeFilter) {
      return false;
    }
    return true;
  });

  if (filteredData.length === 0) {
    document.getElementById('noServersNotice').style.display = 'block';
    return;
  }

  document.getElementById('noServersNotice').style.display = 'none';

  const sortedData = [...filteredData].sort((a, b) => {
    const sortValueA = a[key];
    const sortValueB = b[key];

    let comparison = 0;
    if (sortValueA > sortValueB) {
      comparison = 1;
    } else if (sortValueA < sortValueB) {
      comparison = -1;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  sortedData.forEach(server => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>Name:</strong> ${server.Name}<br>
      <strong>Map:</strong> ${server.Map}<br>
      <strong>Players:</strong> ${server.Players}/${server.MaxPlayers}<br>
      <strong>Queue Players:</strong> ${server.QueuePlayers}<br>
      <strong>Region:</strong> ${server.Region}<br>
      <strong>Game Mode:</strong> ${server.Gamemode}<br>
    `;

    if (server.IsOfficial) {
      listItem.classList.add('official');
    }

    serverList.appendChild(listItem);
  });

  // Remove all active indicators from sort buttons
  const sortButtons = document.querySelectorAll('#sortButtons button');
  sortButtons.forEach(button => button.classList.remove('active', 'asc', 'desc'));

  // Add active indicator and sort order to the current sort button
  const currentSortButton = document.getElementById(`sort${key}`);
  currentSortButton.classList.add('active', sortOrder);

  // Update total player count
  const totalPlayers = filteredData.reduce((sum, server) => sum + server.Players, 0);
  document.getElementById('totalPlayers').textContent = totalPlayers;
};

const toggleOfficialServers = () => {
  showOfficialServers = !showOfficialServers;
  sortServersBy(sortKey);
  updateToggleButtons();
};

const toggleCommunityServers = () => {
  showCommunityServers = !showCommunityServers;
  sortServersBy(sortKey);
  updateToggleButtons();
};

const filterBySize = () => {
  const sizeFilterSelect = document.getElementById('sizeFilter');
  sizeFilter = sizeFilterSelect.value;
  sortServersBy(sortKey);
};

const updateToggleButtons = () => {
  const toggleOfficialButton = document.getElementById('toggleOfficial');
  const toggleCommunityButton = document.getElementById('toggleCommunity');

  toggleOfficialButton.textContent = showOfficialServers ? 'Hide Official Servers' : 'Show Official Servers';
  toggleCommunityButton.textContent = showCommunityServers ? 'Hide Community Servers' : 'Show Community Servers';
};

fetch('https://publicapi.battlebit.cloud/Servers/GetServerList')
  .then(response => response.json())
  .then(data => {
    serversData = data;
    sortServersBy('Gamemode');
    updateToggleButtons();

    // Calculate and display total player count
    const totalPlayers = serversData.reduce((sum, server) => sum + server.Players, 0);
    document.getElementById('totalPlayers').textContent = totalPlayers;
  })
  .catch(error => {
    console.log('Error:', error);
  });
