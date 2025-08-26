import { Node } from '../types';

export const GRID_ROWS = 25;
export const GRID_COLS = 50;
export const START_ROW = 12;
export const START_COL = 10;
export const END_ROW = 12;
export const END_COL = 40;

export const createInitialGrid = (): Node[][] => {
  const grid: Node[][] = [];
  
  for (let row = 0; row < GRID_ROWS; row++) {
    const currentRow: Node[] = [];
    for (let col = 0; col < GRID_COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === START_ROW && col === START_COL,
        isEnd: row === END_ROW && col === END_COL,
        isObstacle: false,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        heuristic: 0,
        totalCost: Infinity,
        previousNode: null,
      });
    }
    grid.push(currentRow);
  }
  
  return grid;
};

export const resetGrid = (grid: Node[][]): Node[][] => {
  return grid.map(row =>
    row.map(node => ({
      ...node,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      heuristic: 0,
      totalCost: Infinity,
      previousNode: null,
    }))
  );
};

export const clearObstacles = (grid: Node[][]): Node[][] => {
  return grid.map(row =>
    row.map(node => ({
      ...node,
      isObstacle: false,
    }))
  );
};

export const getNeighbors = (node: Node, grid: Node[][]): Node[] => {
  const neighbors: Node[] = [];
  const { row, col } = node;
  
  // Up, Down, Left, Right
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;
    
    if (
      newRow >= 0 &&
      newRow < GRID_ROWS &&
      newCol >= 0 &&
      newCol < GRID_COLS &&
      !grid[newRow][newCol].isObstacle
    ) {
      neighbors.push(grid[newRow][newCol]);
    }
  }
  
  return neighbors;
};

export const manhattanDistance = (nodeA: Node, nodeB: Node): number => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};