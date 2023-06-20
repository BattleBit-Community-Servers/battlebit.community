let serversData = [];

let sortKey = '';
let sortOrder = 'asc';
let showOfficialServers = true;
let showCommunityServers = true;
let showRegionFilter = false;
let selectedRegion = '';
let sizeFilter = '';

const refreshData = () => {
  fetch('https://publicapi.battlebit.cloud/Servers/GetServerList')
    .then(response => response.json())
    .then(data => {
      serversData = data;
      sortServersBy(sortKey);
      updateToggleButtons();

      const totalPlayers = serversData.reduce((sum, server) => sum + server.Players, 0);
      document.getElementById('totalPlayers').textContent = totalPlayers;
    })
    .catch(error => {
      console.log('Error:', error);
    });
};

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
    if (showRegionFilter && server.Region !== selectedRegion) {
      return false;
    }
    return true;
  });

  if (filteredData.length === 0) {
    let noticeMessage = 'No servers with that size found.';
    if (!showOfficialServers && !showCommunityServers) {
      noticeMessage = 'Nothing to show because you hid Official and Community Servers.';
    }
    document.getElementById('noServersNotice').textContent = noticeMessage;
    document.getElementById('noServersNotice').style.display = 'block';
    return;
  }

  document.getElementById('noServersNotice').style.display = 'none';

  let sortedData;

  if (sortKey) {
    sortedData = [...filteredData].sort((a, b) => {
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
  } else {
    sortedData = filteredData; // No sorting, use the original order from the API
  }

  sortedData.forEach(server => {
    const listItem = renderServerDetails(server);
    serverList.appendChild(listItem);
  });

  // Remove all active indicators from sort buttons
  const sortButtons = document.querySelectorAll('#sortButtons button');
  sortButtons.forEach(button => button.classList.remove('active', 'asc', 'desc'));

  if (sortKey) {
    // Add active indicator and sort order to the current sort button
    const currentSortButton = document.getElementById(`sort${key}`);
    currentSortButton.classList.add('active', sortOrder);
  }

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

const toggleRegionFilter = () => {
  showRegionFilter = !showRegionFilter;
  const regionFilterSelect = document.getElementById('regionFilter');
  regionFilterSelect.style.display = showRegionFilter ? 'inline-block' : 'none';
  sortServersBy(sortKey);
  updateToggleButtons();
};

const filterBySize = () => {
  const sizeFilterSelect = document.getElementById('sizeFilter');
  sizeFilter = sizeFilterSelect.value;
  sortServersBy(sortKey);
};

const filterByRegion = () => {
  const regionFilterSelect = document.getElementById('regionFilter');
  selectedRegion = regionFilterSelect.value;
  sortServersBy(sortKey);
};

const updateToggleButtons = () => {
  const toggleOfficialButton = document.getElementById('toggleOfficial');
  const toggleCommunityButton = document.getElementById('toggleCommunity');
  const toggleRegionButton = document.getElementById('toggleRegion');

  toggleOfficialButton.textContent = showOfficialServers ? 'Hide Official Servers' : 'Show Official Servers';
  toggleCommunityButton.textContent = showCommunityServers ? 'Hide Community Servers' : 'Show Community Servers';
  toggleRegionButton.textContent = showRegionFilter ? 'Hide Region Filter' : 'Show Region Filter';
};

const renderServerDetails = (server) => {
  const listItem = document.createElement('li');
  listItem.classList.add('column', 'is-one-third');

  const card = document.createElement('div');
  card.classList.add('card');

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  const serverName = document.createElement('p');
  serverName.classList.add('title', 'is-5');
  serverName.textContent = server.Name;

  const serverDetails = document.createElement('p');
  serverDetails.innerHTML = `
    <strong>Map:</strong> ${server.Map}<br>
    <strong>Players:</strong> ${server.Players}/${server.MaxPlayers}<br>
    <strong>Region:</strong> ${server.Region}<br>
    <strong>Game Mode:</strong> ${server.Gamemode}<br>
    <strong>Map Time:</strong> ${server.DayNight}<br>
  `;

  if (server.IsOfficial) {
    card.classList.add('official');
  } else {
    card.classList.add('community');
  }

  cardContent.appendChild(serverName);
  cardContent.appendChild(serverDetails);
  card.appendChild(cardContent);
  listItem.appendChild(card);

  return listItem;
};

// Initial data retrieval and page setup
refreshData();
