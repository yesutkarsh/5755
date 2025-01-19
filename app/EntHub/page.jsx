import Link from "next/link";

// pages/embeddedPage.js
export default function EmbeddedPage() {
    return (
        <>
      <div style={{ width: '100%', height: '100vh' }}>
        <iframe 
          src="https://yesnetflixgpt.vercel.app/browse" // URL of the webpage you want to embed
          width="100%" 
          height="100%" 
          style={{ border: 'none' }} 
          title="Embedded Page"
          />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around items-center py-2">
          <Link href="/">
            <button className="flex flex-col items-center text-gray-700 hover:text-green-600 transition-colors">
              <i className="ri-home-line text-3xl"></i>
              <span className="text-xs">Home</span>
            </button>
          </Link>

          <Link href="/GetTraffic">
            <button className="flex flex-col items-center text-gray-700 hover:text-red-600 transition-colors">
              <i className="ri-map-pin-fill"></i>
              <span className="text-xs">Map</span>
            </button>
          </Link>

          <Link href="/Account">
            <button className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors">
            <i className="ri-user-3-fill"></i>
              <span className="text-xs">Account</span>
            </button>
          </Link>
        </div>
      </div>
          </>
    );
  }
  