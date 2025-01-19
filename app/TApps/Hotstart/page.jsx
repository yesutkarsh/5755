"use client";
// app/page.js or your component file
import Link from "next/link";

export default function EmbeddedPage() {
  return (
    <>
      <div className="h-screen w-full flex flex-col">
        <div className="flex-grow">
          <iframe
            src="/api/proxy?url=https://www.hotstar.com/in/home?ref=%2Fin"
            className="w-full h-full border-none"
            title="Netflix Embed"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
          <div className="flex justify-around items-center py-2">
            <Link href="/" className="flex flex-col items-center text-gray-700 hover:text-green-600 transition-colors">
              <i className="ri-home-line text-3xl"></i>
              <span className="text-xs">Home</span>
            </Link>

            <Link href="/GetTraffic" className="flex flex-col items-center text-gray-700 hover:text-red-600 transition-colors">
              <i className="ri-map-pin-fill text-3xl"></i>
              <span className="text-xs">Map</span>
            </Link>

            <Link href="/Account" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors">
              <i className="ri-user-3-fill text-3xl"></i>
              <span className="text-xs">Account</span>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
