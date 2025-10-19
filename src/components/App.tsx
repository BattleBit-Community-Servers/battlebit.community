import { useState, useEffect, useRef } from "react";
import BobbingArrow from "./BobbingArrow";
import Contributors from "./Contributors";

interface Contributor {
  login: string;
  html_url: string;
  avatar_url: string;
  contributions: number;
}

export default function App() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // Fetch contributors from our server-side cache
    const fetchContributors = async () => {
      try {
        const response = await fetch("/api/contributors");
        if (!response.ok) {
          throw new Error(`Failed to fetch contributors: ${response.status}`);
        }
        const data = await response.json() as Contributor[];
        setContributors(data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
        setContributors([]);
      }
    };

    fetchContributors();
  }, []);

  return (
    <div className="relative h-screen snap-y snap-mandatory overflow-y-scroll">
      {/* First Section: BattleBit Community Servers */}
      <section className="h-screen flex flex-col justify-center bg-gradient-to-r from-red-700 to-gray-900 snap-start relative">
        <div className="flex flex-col items-center">
          <div className="mb-8">
            <div className="h-24 w-24">
              <img
                src="/BBCS_White_Large.svg"
                alt="BattleBit Community Servers Logo"
                width={96}
                height={96}
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
              <button className="bg-blue-500 text-white py-2 px-4 rounded-sm">
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
        <div className="flex justify-center gap-4">
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
              <button className="bg-blue-500 text-white py-2 px-4 rounded-sm">
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
              <button className="bg-blue-500 text-white py-2 px-4 rounded-sm">
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

        <div className="flex justify-center gap-4 mb-10">
          <div className="flex items-center bg-white p-4 rounded-lg shadow-lg w-64">
            <img
              src="/avatar/35661279"
              alt="Jellisy"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="text-blue-700 font-bold">Jellisy</h3>
              <p className="text-gray-700">Organization Founder</p>
            </div>
          </div>

          <div className="flex items-center bg-white p-4 rounded-lg shadow-lg w-64">
            <img
              src="/avatar/51454971"
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
