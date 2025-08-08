import React from "react";

export default function ChatPageShimmer() {
  const messages = new Array(6).fill(0);

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      {/* Header Shimmer */}
      <header className="border-b bg-zinc-700 px-4 py-3">
        <div className="flex items-center space-x-4 animate-pulse">
          <div className="h-8 w-8 rounded-full bg-gray-600"></div>
          <div className="h-10 w-10 rounded-full bg-gray-600"></div>
          <div>
            <div className="h-4 w-24 bg-gray-600 rounded mb-2"></div>
            <div className="h-3 w-16 bg-gray-600 rounded"></div>
          </div>
        </div>
      </header>

      {/* Messages Shimmer */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((_, index) => (
          <div
            key={index}
            className={`flex ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                index % 2 !== 0 ? "flex-row-reverse space-x-reverse" : ""
              } animate-pulse`}
            >
              <div className="h-8 w-8 rounded-full bg-gray-600"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-600 rounded"></div>
                <div className="h-3 w-16 bg-gray-500 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar Shimmer */}
      <div className="border-t bg-zinc-700 p-4">
        <div className="flex space-x-2 animate-pulse">
          <div className="flex-1 h-10 rounded-lg bg-gray-600"></div>
          <div className="h-10 w-10 rounded-lg bg-gray-600"></div>
        </div>
      </div>
    </div>
  );
}
