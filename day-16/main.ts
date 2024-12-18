const END_TILE = "E";
const EMPTY_TILE = ".";

enum Direction {
  HORIZONTAL = 0,
  VERTICAL = 1,
}

type Possibility = [
  visited: [number, number][],
  points: number,
  direction: number,
];

const dirs = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1],
];

let init_dir = Direction.HORIZONTAL;
const finished_paths: number[] = [];
let paths: Possibility[] = [];

async function main() {
  const grid = await readfile();
  const [init_x, init_y] = [1, grid[0].length - 2];
  paths.push([[[init_x, init_y]], 0, init_dir]);
  while (paths.length !== 0) {
    const newPaths: Possibility[] = [];
    for (const path of paths) {
      const recent = nextpaths(path, grid);
      recent.length > 0 && newPaths.push(...recent);
    }
    paths = newPaths.sort((a, b) => a[1] - b[1]);
  }
  console.log([...new Set(finished_paths)].sort((a, b) => a - b)[0]);
}

const isVisited = (arr: [number, number][], x: number, y: number) =>
  arr.some((el) => el[0] === x && el[1] === y);

function nextpaths(path: Possibility, grid: string[]): Possibility[] {
  const newPaths: Possibility[] = [];
  const [visited, points, direction] = path;
  const [curr_x, curr_y] = visited[visited.length - 1];

  for (const [x_dir, y_dir] of dirs) {
    const newDirection =
      x_dir === 0 ? Direction.VERTICAL : Direction.HORIZONTAL;
    const newPoints = points + (direction === newDirection ? 1 : 1001);
    if (newPoints > 105576) continue;
    //Check if next position is the final
    if (grid[curr_y + y_dir][curr_x + x_dir] === END_TILE) {
      finished_paths.push(newPoints);
      continue;
    }

    // Check if possible to follow new path
    if (
      !isVisited(visited, curr_x + x_dir, curr_y + y_dir) &&
      grid[curr_y + y_dir][curr_x + x_dir] === EMPTY_TILE
    ) {
      newPaths.push([
        [...visited, [curr_x + x_dir, curr_y + y_dir]],
        newPoints,
        newDirection,
      ]);
    }
  }

  return newPaths;
}

function isShortestPath(
  x: number,
  y: number,
  currPath: [number, number][],
  points: number,
): Boolean {
  const index = paths.findIndex(
    ([visited, pts, dir]) => isVisited(visited, x, y) && points > pts,
  );
  if (index > -1) return false;
  return true;
}

async function readfile() {
  const file = Bun.file("test.txt");
  return (await file.text()).split("\n");
}

main();
