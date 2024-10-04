import Image from 'next/image';
import BobbingArrow from "./ClientComponent"; // Import the BobbingArrow component
import Contributors from "./Contributors"; // Import the Contributors component

// Constants for GitHub data
const ORG_NAME = "BattleBit-Community-Servers";
const REPO_NAMES = [
  "BattleBitAPIRunner",
  "BBModules-Backend",
  "BBModules-Frontend",
];
const EXCLUDED_USERS = ["JellisyWoes", "RainOrigami"];

// Page component: Display contributors and other content
export default async function BattleBitCommunityServersPage() {
  const contributors = await fetchContributors(); // Fetch contributors within the component

  return (
    <div className="relative h-screen snap-y snap-mandatory overflow-y-scroll">
      {/* First Section: BattleBit Community Servers */}
      <section className="h-screen flex flex-col justify-center bg-gradient-to-r from-red-700 to-gray-900 snap-start relative">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <div className="h-24 w-24">
              <Image
                src="/BBCS_White_Large.svg"
                alt="BattleBit Community Servers Logo"
                width={96} // Specify width (24 * 4 for h-24)
                height={96} // Specify height (24 * 4 for h-24)
              />
            </div>
          </div>

          <h1 className="text-white text-4xl font-bold mb-4 text-center">
            BattleBit Community Servers
          </h1>

          <p className="text-gray-300 text-lg text-center px-4 max-w-2xl">
            Welcome to the BattleBit Community Servers organization! This
            organization was created to host scripts and resources that will
            help you run your own BattleBit community servers.
          </p>
        </div>
      </section>

      {/* Second Section: Our Latest Projects */}
      <section className="bg-gray-100 h-screen py-12 flex flex-col justify-center snap-start">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-black">
            Our Latest Projects
          </h2>
        </div>

        {/* Cards for Latest Projects */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80 text-center border border-gray-300">
            <h3 className="text-xl font-bold mb-2 text-black">BBModules</h3>
            <p className="text-gray-700 mb-2">
              A place to share modules for the BattleBit Modular API.
            </p>
            <a
              href="https://modules.battlebit.community/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-blue-500 text-white py-2 px-4 rounded">
                Visit Site
              </button>
            </a>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-black">
            Explore Our Repositories
          </h2>
        </div>

        {/* Cards for Repositories */}
        <div className="flex justify-center space-x-4">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80 text-center border border-gray-300">
            <h3 className="text-xl font-bold mb-2 text-black">
              Community Server Launcher
            </h3>
            <p className="text-gray-700 mb-2">
              Set up and manage your BattleBit community server effortlessly.
            </p>
            <a
              href="https://github.com/BattleBit-Community-Servers/Battlebit-Community-Server-Launcher"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-blue-500 text-white py-2 px-4 rounded">
                View Repository
              </button>
            </a>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg w-80 text-center border border-gray-300">
            <h3 className="text-xl font-bold mb-2 text-black">
              BattleBit API Runner
            </h3>
            <p className="text-gray-700 mb-2">
              Execute and manage the BattleBit API for streamlined operations.
            </p>
            <a
              href="https://github.com/BattleBit-Community-Servers/BattleBitAPIRunner"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-blue-500 text-white py-2 px-4 rounded">
                View Repository
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Third Section: Meet Our Team and Contributors */}
      <section className="bg-gray-100 h-screen py-12 flex flex-col justify-center snap-start">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-black">Meet Our Team</h2>
        </div>

        <div className="flex justify-center space-x-4 mb-10">
          <div className="flex items-center bg-white p-4 rounded-lg shadow-lg w-64">
            <Image
              src="https://avatars.githubusercontent.com/u/35661279?v=4" // Replace with the actual path to Jellisy's image
              alt="Jellisy"
              width={48} // Equivalent to h-12
              height={48} // Equivalent to w-12
              className="rounded-full"
            />
            <div>
              <h3 className="text-blue-700 font-bold">Jellisy</h3>
              <p className="text-gray-700">Organization Founder</p>
            </div>
          </div>

          <div className="flex items-center bg-white p-4 rounded-lg shadow-lg w-64">
            <Image
              src="https://avatars.githubusercontent.com/u/51454971?v=4" // Replace with the actual path to RainOrigami's image
              alt="RainOrigami"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="text-blue-700 font-bold">RainOrigami</h3>
              <p className="text-gray-700">API Runner Creator</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-black">
            Meet the Contributors
          </h2>
        </div>

        <Contributors contributors={contributors} />
      </section>

      {/* Bobbing Arrow fixed to viewport */}
      <div className="fixed bottom-10 left-0 right-0 flex justify-center">
        <BobbingArrow />
      </div>
    </div>
  );
}

// Helper function to fetch GitHub contributors
async function fetchContributors() {
  const allContributors = [];

  const filterContributors = (data, allContributors) => {
    return data.filter((contributor) => {
      return (
        !contributor.login.endsWith("[bot]") &&
        !allContributors.some((c) => c.login === contributor.login) &&
        !EXCLUDED_USERS.includes(contributor.login)
      );
    });
  };

  try {
    for (const repoName of REPO_NAMES) {
      const githubApiUrl = `https://api.github.com/repos/${ORG_NAME}/${repoName}/contributors`;
      const response = await fetch(githubApiUrl, {
        next: { revalidate: 86400 }, // Revalidate the cache every 24 hours (86400 seconds)
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch contributors for ${repoName}: ${response.status}`
        );
      }

      const data = await response.json();
      const filteredContributors = filterContributors(data, allContributors);
      allContributors.push(...filteredContributors);
    }

    return allContributors;
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return [];
  }
}
