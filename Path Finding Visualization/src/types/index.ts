export interface Node {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isObstacle: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  heuristic: number;
  totalCost: number;
  previousNode: Node | null;
}

export type AlgorithmType = 'astar' | 'dijkstra' | 'bfs' | 'dfs';

export interface AlgorithmResult {
  visitedNodes: Node[];
  shortestPath: Node[];
}