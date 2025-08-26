import React from 'react';
import { AlgorithmType } from '../types';
import { Play, Square, RotateCcw, Eraser } from 'lucide-react';

interface ControlsProps {
  algorithm: AlgorithmType;
  setAlgorithm: (algorithm: AlgorithmType) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onClearObstacles: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  isRunning,
  onStart,
  onStop,
  onReset,
  onClearObstacles,
}) => {
  const algorithms = [
    { value: 'astar' as AlgorithmType, label: 'A* Algorithm' },
    { value: 'dijkstra' as AlgorithmType, label: "Dijkstra's Algorithm" },
    { value: 'bfs' as AlgorithmType, label: 'Breadth-First Search' },
    { value: 'dfs' as AlgorithmType, label: 'Depth-First Search' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Controls</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isRunning}
        >
          {algorithms.map((alg) => (
            <option key={alg.value} value={alg.value}>
              {alg.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Speed: {speed}ms
        </label>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full"
          disabled={isRunning}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={isRunning ? onStop : onStart}
          className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isRunning ? <Square size={16} /> : <Play size={16} />}
          <span>{isRunning ? 'Stop' : 'Start'}</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
          disabled={isRunning}
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>

        <button
          onClick={onClearObstacles}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium transition-colors col-span-2"
          disabled={isRunning}
        >
          <Eraser size={16} />
          <span>Clear Obstacles</span>
        </button>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Instructions:</strong></p>
        <p>• Click and drag to draw obstacles</p>
        <p>• Click start/end nodes to move them</p>
        <p>• Select algorithm and speed, then click Start</p>
      </div>
    </div>
  );
};

export default Controls;