"use client";

import { useState } from "react";

export default function ReadingPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col flex-1 bg-[#0B0B0F] min-h-0">
      {/* Loader */}
      {!loaded && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#C9A962]/30 border-t-[#C9A962] mb-4 animate-spin" />
            <p className="text-[#C9A962] text-sm font-medium">
              Connecting to your reader...
            </p>
          </div>
        </div>
      )}

      {/* Iframe Wrapper - fills all available space */}
      <div className={`flex-1 relative min-h-0 ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
        <iframe
          src="https://ginni-ki-baatein-buddy.lovable.app"
          className="w-full h-full border-none bg-[#0B0B0F]"
          onLoad={() => setLoaded(true)}
          allow="clipboard-write; microphone; camera"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}

