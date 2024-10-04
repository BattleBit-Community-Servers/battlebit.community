import React from "react";
import Image from "next/image"; // Import Next.js Image component

export default function Contributors({ contributors }) {
  return (
    <div className="contributors-container text-center mt-8">
      <div className="flex justify-center space-x-4">
        {contributors.length > 0 ? (
          contributors.map((contributor) => (
            <div key={contributor.login} className="contributor-box">
              <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  width={48}  // Equivalent to w-12
                  height={48} // Equivalent to h-12
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
