import React from 'react';

export function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
              activeTab === tab.id
                ? 'text-lifewood-castletonGreen bg-lifewood-seaSalt'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-lifewood-castletonGreen text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </div>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lifewood-castletonGreen" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}