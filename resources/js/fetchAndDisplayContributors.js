// Wrap your code in an event listener for the "DOMContentLoaded" event
document.addEventListener('DOMContentLoaded', () => {
  const contributorsContainer = document.getElementById('contributors-container');

  // Replace 'BattleBit-Community-Servers' with the organization name
  const orgName = 'BattleBit-Community-Servers';

  // Array of repository names
  const repoNames = ['BattleBitAPIRunner', 'BBModules-Backend', 'BBModules-Frontend'];

  // Users to exclude from contributors
  const excludedUsers = ['JellisyWoes', 'RainOrigami'];

  // Function to fetch contributors and cache the data
  const fetchAndCacheContributors = async () => {
    try {
      // Check if cached data exists in localStorage
      const cachedContributors = localStorage.getItem('cachedContributors');

      if (cachedContributors) {
        // Use the cached data if available
        const cachedData = JSON.parse(cachedContributors);
        displayContributors(cachedData);
      } else {
        const allContributors = [];

        for (const repoName of repoNames) {
          // Replace 'orgName' and 'repoName' in the GitHub API URL
          const githubApiUrl = `https://api.github.com/repos/${orgName}/${repoName}/contributors`;

          // Make a GET request to the GitHub API for each repository
          const response = await fetch(githubApiUrl);
          const data = await response.json();

          // Filter out GitHub Actions contributors, duplicates, and excluded users
          const filteredContributors = data.filter(contributor => {
            return (
              !contributor.login.endsWith('[bot]') &&
              !allContributors.some(c => c.login === contributor.login) &&
              !excludedUsers.includes(contributor.login)
            );
          });

          // Add filtered contributors from this repository to the combined array
          allContributors.push(...filteredContributors);
        }

        // Cache the data in localStorage
        localStorage.setItem('cachedContributors', JSON.stringify(allContributors));

        // Display the contributors
        displayContributors(allContributors);
      }
    } catch (error) {
      console.error('Error fetching contributor data:', error);
      contributorsContainer.innerHTML = 'Error fetching contributor data.';
    }
  };

  // Function to display contributors
  const displayContributors = (contributors) => {
    // Process the contributor data and build contributor elements
    const contributorElements = contributors.map(contributor => {
      return `
        <div class="contributor-box">
          <a href="${contributor.html_url}" target="_blank">
            <img src="${contributor.avatar_url}" alt="${contributor.login}">
          </a>
        </div>
      `;
    });

    // Insert the contributor elements into the container
    contributorsContainer.innerHTML = contributorElements.join('');
  };

  // Call the fetchAndCacheContributors function to fetch and display contributors, using cached data if available
  fetchAndCacheContributors();
});
