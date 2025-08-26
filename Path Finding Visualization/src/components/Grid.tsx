import React from 'react';
import { Node } from '../types';

interface GridProps {
  grid: Node[][];
  onMouseDown: (node: Node) => void;
  onMouseEnter: (node: Node) => void;
  onMouseUp: () => void;
}

const Grid: React.FC<GridProps> = ({ grid, onMouseDown, onMouseEnter, onMouseUp }) => {
  const getNodeClassName = (node: Node): string => {
    const baseClasses = 'w-5 h-5 border border-gray-300 cursor-pointer transition-all duration-150';
    
    if (node.isStart) {
      return `${baseClasses} bg-green-500 hover:bg-green-600`;
    }
    if (node.isEnd) {
      return `${baseClasses} bg-red-500 hover:bg-red-600`;
    }
    if (node.isPath) {
      return `${baseClasses} bg-yellow-400 animate-pulse`;
    }
    if (node.isVisited) {
      return `${baseClasses} bg-blue-200 hover:bg-blue-300`;
    }
    if (node.isObstacle) {
      return `${baseClasses} bg-gray-800 hover:bg-gray-900`;
    }
    
    return `${baseClasses} bg-white hover:bg-gray-100`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 inline-block">
      <div 
        className="grid gap-0 select-none"
        style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))` }}
        onMouseLeave={onMouseUp}
      >
        {grid.map((row, rowIndex) =>
          row.map((node, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getNodeClassName(node)}
              onMouseDown={() => onMouseDown(node)}
              onMouseEnter={() => onMouseEnter(node)}
              onMouseUp={onMouseUp}
              title={`Row: ${node.row}, Col: ${node.col}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;