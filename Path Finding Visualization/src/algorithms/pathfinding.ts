import { Node, AlgorithmResult } from '../types';
import { getNeighbors, manhattanDistance } from '../utils/grid';

export const astar = (startNode: Node, endNode: Node, grid: Node[][]): AlgorithmResult => {
  const visitedNodes: Node[] = [];
  const unvisitedNodes: Node[] = [startNode];
  startNode.distance = 0;
  startNode.heuristic = manhattanDistance(startNode, endNode);
  startNode.totalCost = startNode.heuristic;

  while (unvisitedNodes.length > 0) {
    // Sort by total cost (f = g + h)
    unvisitedNodes.sort((a, b) => a.totalCost - b.totalCost);
    const currentNode = unvisitedNodes.shift()!;

    if (currentNode.isObstacle) continue;
    if (currentNode.distance === Infinity) break;

    currentNode.isVisited = true;
    visitedNodes.push(currentNode);

    if (currentNode === endNode) {
      return { visitedNodes, shortestPath: getShortestPath(endNode) };
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isObstacle) {
        const tentativeDistance = currentNode.distance + 1;
        
        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance;
          neighbor.heuristic = manhattanDistance(neighbor, endNode);
          neighbor.totalCost = neighbor.distance + neighbor.heuristic;
          neighbor.previousNode = currentNode;
          
          if (!unvisitedNodes.includes(neighbor)) {
            unvisitedNodes.push(neighbor);
          }
        }
      }
    }
  }

  return { visitedNodes, shortestPath: [] };
};

export const dijkstra = (startNode: Node, endNode: Node, grid: Node[][]): AlgorithmResult => {
  const visitedNodes: Node[] = [];
  const unvisitedNodes: Node[] = [];
  
  // Initialize all nodes
  for (const row of grid) {
    for (const node of row) {
      unvisitedNodes.push(node);
    }
  }
  
  startNode.distance = 0;

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const currentNode = unvisitedNodes.shift()!;

    if (currentNode.isObstacle) continue;
    if (currentNode.distance === Infinity) break;

    currentNode.isVisited = true;
    visitedNodes.push(currentNode);

    if (currentNode === endNode) {
      return { visitedNodes, shortestPath: getShortestPath(endNode) };
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isObstacle) {
        const tentativeDistance = currentNode.distance + 1;
        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance;
          neighbor.previousNode = currentNode;
        }
      }
    }
  }

  return { visitedNodes, shortestPath: [] };
};

export const bfs = (startNode: Node, endNode: Node, grid: Node[][]): AlgorithmResult => {
  const visitedNodes: Node[] = [];
  const queue: Node[] = [startNode];
  startNode.isVisited = true;
  startNode.distance = 0;

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    visitedNodes.push(currentNode);

    if (currentNode === endNode) {
      return { visitedNodes, shortestPath: getShortestPath(endNode) };
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isObstacle) {
        neighbor.isVisited = true;
        neighbor.distance = currentNode.distance + 1;
        neighbor.previousNode = currentNode;
        queue.push(neighbor);
      }
    }
  }

  return { visitedNodes, shortestPath: [] };
};

export const dfs = (startNode: Node, endNode: Node, grid: Node[][]): AlgorithmResult => {
  const visitedNodes: Node[] = [];
  const stack: Node[] = [startNode];

  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    
    if (currentNode.isVisited || currentNode.isObstacle) continue;
    
    currentNode.isVisited = true;
    visitedNodes.push(currentNode);

    if (currentNode === endNode) {
      return { visitedNodes, shortestPath: getShortestPath(endNode) };
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors.reverse()) {
      if (!neighbor.isVisited && !neighbor.isObstacle) {
        neighbor.previousNode = currentNode;
        stack.push(neighbor);
      }
    }
  }

  return { visitedNodes, shortestPath: [] };
};

const getShortestPath = (endNode: Node): Node[] => {
  const shortestPath: Node[] = [];
  let currentNode: Node | null = endNode;
  
  while (currentNode !== null) {
    shortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return shortestPath;
};