import React, { useState, useCallback, useRef } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import Legend from './components/Legend';
import { Node, AlgorithmType } from './types';
import { createInitialGrid, resetGrid, clearObstacles, GRID_ROWS, GRID_COLS } from './utils/grid';
import { astar, dijkstra, bfs, dfs } from './algorithms/pathfinding';
import { Navigation } from 'lucide-react';

const App: React.FC = () => {
  const [grid, setGrid] = useState<Node[][]>(createInitialGrid);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('astar');
  const [speed, setSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  const getAlgorithmFunction = (algorithmType: AlgorithmType) => {
    switch (algorithmType) {
      case 'astar':
        return astar;
      case 'dijkstra':
        return dijkstra;
      case 'bfs':
        return bfs;
      case 'dfs':
        return dfs;
      default:
        return astar;
    }
  };

  const findStartNode = (currentGrid: Node[][]): Node => {
    for (const row of currentGrid) {
      for (const node of row) {
        if (node.isStart) return node;
      }
    }
    return currentGrid[0][0]; // fallback
  };

  const findEndNode = (currentGrid: Node[][]): Node => {
    for (const row of currentGrid) {
      for (const node of row) {
        if (node.isEnd) return node;
      }
    }
    return currentGrid[0][0]; // fallback
  };

  const visualizeAlgorithm = useCallback(() => {
    const currentGrid = resetGrid(grid);
    setGrid(currentGrid);
    setIsRunning(true);
    
    const startNode = findStartNode(currentGrid);
    const endNode = findEndNode(currentGrid);
    const algorithmFunction = getAlgorithmFunction(algorithm);
    
    const { visitedNodes, shortestPath } = algorithmFunction(startNode, endNode, currentGrid);
    
    // Clear any existing timeouts
    timeoutRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutRef.current = [];
    
    // Animate visited nodes
    visitedNodes.forEach((node, index) => {
      const timeout = setTimeout(() => {
        if (node !== startNode && node !== endNode) {
          setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            newGrid[node.row][node.col] = { ...node, isVisited: true };
            return newGrid;
          });
        }
        
        // After all visited nodes are animated, animate the shortest path
        if (index === visitedNodes.length - 1) {
          setTimeout(() => {
            shortestPath.forEach((pathNode, pathIndex) => {
              const pathTimeout = setTimeout(() => {
                if (pathNode !== startNode && pathNode !== endNode) {
                  setGrid(prevGrid => {
                    const newGrid = prevGrid.map(row => [...row]);
                    newGrid[pathNode.row][pathNode.col] = { ...pathNode, isPath: true };
                    return newGrid;
                  });
                }
                
                if (pathIndex === shortestPath.length - 1) {
                  setIsRunning(false);
                }
              }, pathIndex * 50);
              timeoutRef.current.push(pathTimeout);
            });
          }, 200);
        }
      }, index * speed);
      timeoutRef.current.push(timeout);
    });
  }, [grid, algorithm, speed]);

  const handleStart = () => {
    visualizeAlgorithm();
  };

  const handleStop = () => {
    timeoutRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutRef.current = [];
    setIsRunning(false);
  };

  const handleReset = () => {
    handleStop();
    setGrid(resetGrid(grid));
  };

  const handleClearObstacles = () => {
    handleStop();
    setGrid(clearObstacles(resetGrid(grid)));
  };

  const handleMouseDown = (node: Node) => {
    if (isRunning) return;
    
    if (node.isStart) {
      setIsDraggingStart(true);
    } else if (node.isEnd) {
      setIsDraggingEnd(true);
    } else {
      setIsMousePressed(true);
      toggleObstacle(node);
    }
  };

  const handleMouseEnter = (node: Node) => {
    if (isRunning) return;
    
    if (isDraggingStart && !node.isEnd && !node.isObstacle) {
      moveStartNode(node);
    } else if (isDraggingEnd && !node.isStart && !node.isObstacle) {
      moveEndNode(node);
    } else if (isMousePressed && !node.isStart && !node.isEnd) {
      toggleObstacle(node);
    }
  };

  const handleMouseUp = () => {
    setIsMousePressed(false);
    setIsDraggingStart(false);
    setIsDraggingEnd(false);
  };

  const toggleObstacle = (node: Node) => {
    if (node.isStart || node.isEnd) return;
    
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      newGrid[node.row][node.col] = {
        ...node,
        isObstacle: !node.isObstacle,
        isVisited: false,
        isPath: false,
      };
      return newGrid;
    });
  };

  const moveStartNode = (node: Node) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      
      // Remove old start
      for (const row of newGrid) {
        for (const n of row) {
          if (n.isStart) {
            n.isStart = false;
          }
        }
      }
      
      // Set new start
      newGrid[node.row][node.col] = {
        ...node,
        isStart: true,
        isObstacle: false,
        isVisited: false,
        isPath: false,
      };
      
      return newGrid;
    });
  };

  const moveEndNode = (node: Node) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      
      // Remove old end
      for (const row of newGrid) {
        for (const n of row) {
          if (n.isEnd) {
            n.isEnd = false;
          }
        }
      }
      
      // Set new end
      newGrid[node.row][node.col] = {
        ...node,
        isEnd: true,
        isObstacle: false,
        isVisited: false,
        isPath: false,
      };
      
      return newGrid;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Navigation className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-800">
              Pathfinding Visualizer
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Interactive visualization of popular pathfinding algorithms. 
            Draw obstacles, select an algorithm, and watch it find the optimal path!
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 flex justify-center">
            <Grid
              grid={grid}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          </div>

          <div className="lg:w-80 w-full space-y-6">
            <Controls
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              speed={speed}
              setSpeed={setSpeed}
              isRunning={isRunning}
              onStart={handleStart}
              onStop={handleStop}
              onReset={handleReset}
              onClearObstacles={handleClearObstacles}
            />
            <Legend />
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
};

export default App;