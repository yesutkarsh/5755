"use client";
import React, { useState, useCallback } from 'react';
import { Camera, Video, Mic, MicOff, VideoOff, Users, Link as LinkIcon, Copy, X } from 'lucide-react';

export default function GoogleMeetUI() {
  const [meetingLink, setMeetingLink] = useState('');
  const [joinLink, setJoinLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);

  // Generate a more realistic-looking meeting link
  const generateMeetingId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let result = '';
    
    // Format: xxx-xxxx-xxx (where x can be letter or number)
    for (let i = 0; i < 11; i++) {
      if (i === 3 || i === 8) {
        result += '-';
        continue;
      }
      const useNumber = Math.random() > 0.5;
      const source = useNumber ? numbers : chars;
      result += source.charAt(Math.floor(Math.random() * source.length));
    }
    return result;
  };

  const handleStartMeeting = useCallback(() => {
    const newLink = `https://meet.google.com/${generateMeetingId()}`;
    setMeetingLink(newLink);
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setIsCopied(true);
      setShowCopiedAlert(true);
      setTimeout(() => setShowCopiedAlert(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }, [meetingLink]);

  const handleJoinMeeting = useCallback(() => {
    if (!joinLink.trim()) {
      alert('Please enter a meeting link');
      return;
    }
    // Here you would typically handle the join meeting logic
    window.open(joinLink, '_blank');
  }, [joinLink]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Copied Alert */}
      {showCopiedAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-down">
          <span>Link copied to clipboard!</span>
          <button onClick={() => setShowCopiedAlert(false)} className="text-white hover:text-gray-200">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <Camera className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Google Meet</h1>
            </div>
            <p className="mt-2 text-blue-100">Secure video meetings for teams and individuals</p>
          </div>

          <div className="p-6 md:p-8">
            {/* Start Meeting Section */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full ${
                    isVideoOn ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  } hover:bg-opacity-80 transition-colors`}
                >
                  {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
                </button>
                <button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className={`p-3 rounded-full mt-2 md:mt-0 ${
                    isAudioOn ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  } hover:bg-opacity-80 transition-colors`}
                >
                  {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>
                <button
                  onClick={handleStartMeeting}
                  className="mt-4 md:mt-0 flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-colors flex items-center justify-center space-x-2"
                >
                  <Users size={20} />
                  <span>Start New Meeting</span>
                </button>
              </div>

              {/* Meeting Link Section */}
              {meetingLink && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <LinkIcon size={20} />
                      <span>Your meeting link:</span>
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className={`p-2 rounded-md flex items-center space-x-1 ${
                        isCopied ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      } hover:bg-opacity-80 transition-colors`}
                    >
                      <Copy size={16} />
                      <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={meetingLink}
                    readOnly
                    className="mt-2 w-full p-3 bg-white border border-gray-200 rounded-lg text-gray-700 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Join Meeting Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Join a meeting</h2>
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                  <input
                    type="text"
                    value={joinLink}
                    onChange={(e) => setJoinLink(e.target.value)}
                    placeholder="Enter meeting code or link"
                    className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={handleJoinMeeting}
                    className="py-3 px-6 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none transition-colors flex items-center justify-center space-x-2"
                  >
                    <Video size={20} />
                    <span>Join Meeting</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Learn more about <a href="#" className="text-blue-600 hover:underline">Google Meet</a></p>
        </div>
      </div>
    </div>
  );
}