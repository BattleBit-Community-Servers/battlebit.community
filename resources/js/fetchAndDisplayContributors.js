// Constants
const ORG_NAME = 'BattleBit-Community-Servers';
const REPO_NAMES = ['BattleBitAPIRunner', 'BBModules-Backend', 'BBModules-Frontend'];
const EXCLUDED_USERS = ['JellisyWoes', 'RainOrigami'];
const CACHE_EXPIRATION_HOURS = 2;

// Error handling function
const handleFetchError = (error) => {
  const errorContainer = document.getElementById('contributors-container');
  
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    errorContainer.innerHTML = 'Network error: Unable to fetch contributor data. Please check your internet connection and try again.';
  } else if (error instanceof TypeError && error.message === 'Network request failed') {
    errorContainer.innerHTML = 'Network request failed. Please ensure that you can access the GitHub API and try again later.';
  } else if (error.message.includes('rate limit exceeded')) {
    errorContainer.innerHTML = 'API rate limit exceeded. Please wait for a while or authenticate with GitHub to increase the rate limit.';
  } else {
    errorContainer.innerHTML = 'An error occurred while fetching contributor data. Please try again later.';
  }
};

// Fetch contributors function
const fetchContributors = async (repoName) => {
  const githubApiUrl = `https://api.github.com/repos/${ORG_NAME}/${repoName}/contributors`;
  const response = await fetch(githubApiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch contributors for ${repoName}: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

// Filter contributors function
const filterContributors = (data, allContributors) => {
  return data.filter((contributor) => {
    return (
      !contributor.login.endsWith('[bot]') &&
      !allContributors.some((c) => c.login === contributor.login) &&
      !EXCLUDED_USERS.includes(contributor.login)
    );
  });
};

// Fetch and cache contributors function
const fetchAndCacheContributors = async () => {
  try {
    const contributorsContainer = document.getElementById('contributors-container');

    // Check if cached data exists in localStorage and if it's still valid
    const cachedContributors = localStorage.getItem('cachedContributors');
    const cachedTimestamp = localStorage.getItem('cachedTimestamp');

    if (cachedContributors && cachedTimestamp) {
      const currentTime = Date.now();
      const cachedTime = parseInt(cachedTimestamp, 10);
      const timeDiffInHours = (currentTime - cachedTime) / (1000 * 60 * 60);

      // Check if the cached data is less than the defined cache expiration hours
      if (timeDiffInHours < CACHE_EXPIRATION_HOURS) {
        const cachedData = JSON.parse(cachedContributors);
        displayContributors(cachedData);
        return;
      }
    }

    const allContributors = [];

    for (const repoName of REPO_NAMES) {
      const data = await fetchContributors(repoName);
      const filteredContributors = filterContributors(data, allContributors);
      allContributors.push(...filteredContributors);
    }

    // Cache the data and current timestamp in localStorage
    localStorage.setItem('cachedContributors', JSON.stringify(allContributors));
    localStorage.setItem('cachedTimestamp', Date.now().toString());

    // Display the contributors
    displayContributors(allContributors);
  } catch (error) {
    handleFetchError(error);
  }
};

// Function to display contributors
const displayContributors = (contributors) => {
  const contributorsContainer = document.getElementById('contributors-container');
  const contributorElements = contributors.map((contributor) => {
    return `
      <div class="contributor-box">
        <a href="${contributor.html_url}" target="_blank">
          <img src="${contributor.avatar_url}" alt="${contributor.login}">
        </a>
      </div>
    `;
  });

  contributorsContainer.innerHTML = contributorElements.join('');
};

// Wrap your code in an event listener for the "DOMContentLoaded" event
document.addEventListener('DOMContentLoaded', () => {
  fetchAndCacheContributors();
});
