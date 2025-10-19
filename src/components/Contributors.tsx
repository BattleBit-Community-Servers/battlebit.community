import React from "react";

interface Contributor {
  login: string;
  html_url: string;
  avatar_url: string;
}

interface ContributorsProps {
  contributors: Contributor[];
}

export default function Contributors({ contributors }: ContributorsProps) {
  // Extract user ID from avatar URL
  const getUserId = (avatarUrl: string): string => {
    const match = avatarUrl.match(/\/u\/(\d+)/);
    return match?.[1] || "";
  };

  return (
    <div className="contributors-container text-center mt-8">
      <div className="flex justify-center gap-4">
        {contributors.length > 0 ? (
          contributors.map((contributor) => (
            <div key={contributor.login} className="contributor-box">
              <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                <img
                  src={`/avatar/${getUserId(contributor.avatar_url)}`}
                  alt={contributor.login}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No contributors found.</p>
        )}
      </div>
    </div>
  );
}
