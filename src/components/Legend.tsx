import React from 'react';

const Legend: React.FC = () => {
  const legendItems = [
    { color: 'bg-green-500', label: 'Start Node' },
    { color: 'bg-red-500', label: 'End Node' },
    { color: 'bg-gray-800', label: 'Obstacle' },
    { color: 'bg-blue-200', label: 'Visited' },
    { color: 'bg-yellow-400', label: 'Shortest Path' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Legend</h3>
      <div className="space-y-3">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded ${item.color} border border-gray-300`}></div>
            <span className="text-sm text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;