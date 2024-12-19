const END_TILE = "E";
const EMPTY_TILE = ".";

enum Direction {
  HORIZONTAL = 0,
  VERTICAL = 1,
}

type Possibility = [visited: [number, number, number][], direction: number];

const dirs = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1],
];

let init_dir = Direction.HORIZONTAL;
const finished_paths: number[] = [];
let paths: Possibility[] = [];
let newPaths: Possibility[] = [];

async function main() {
  const grid = await readfile();
  const [init_x, init_y] = [1, grid[0].length - 2];
  paths.push([[[init_x, init_y, 0]], init_dir]);
  while (paths.length !== 0) {
    newPaths = [];
    for (const path of paths) {
      const recent = nextpaths(path, grid);
      recent.length > 0 && newPaths.push(...recent);
    }

    paths = newPaths;
  }
  console.log([...new Set(finished_paths)].sort((a, b) => a - b));
}

const isVisited = (arr: [number, number, number][], x: number, y: number) =>
  arr.some((el) => el[0] === x && el[1] === y);

function nextpaths(path: Possibility, grid: string[]): Possibility[] {
  const currNewPaths: Possibility[] = [];
  const [visited, direction] = path;
  const [curr_x, curr_y] = visited[visited.length - 1];

  for (const [x_dir, y_dir] of dirs) {
    const newDirection =
      x_dir === 0 ? Direction.VERTICAL : Direction.HORIZONTAL;

    const newPoints = direction === newDirection ? 1 : 1001;

    //Check if next position is the final
    if (grid[curr_y + y_dir][curr_x + x_dir] === END_TILE) {
      finished_paths.push(getPositionCost(visited) + newPoints);
      continue;
    }

    // Check if possible to follow new path
    if (
      grid[curr_y + y_dir][curr_x + x_dir] === EMPTY_TILE &&
      !isVisited(visited, curr_x + x_dir, curr_y + y_dir) &&
      isShortestPath(
        curr_x + x_dir,
        curr_y + y_dir,
        visited,
        newPoints,
        newDirection,
      )
    ) {
      currNewPaths.push([
        [...visited, [curr_x + x_dir, curr_y + y_dir, newPoints]],
        newDirection,
      ]);
    }
  }

  return currNewPaths;
}

function getPositionCost(arr: [number, number, number][]) {
  return arr.reduce((prev, curr) => curr[2] + prev, 0);
}

function isShortestPath(
  x: number,
  y: number,
  currPath: [number, number, number][],
  points: number,
  newDirection: number,
): Boolean {
  let pos: number = 0;
  let isShorter: Boolean = false;
  const index = paths.findIndex(([visited, dir], i) => {
    if (isVisited(visited, x, y)) {
      pos = i;
      return true;
    }
    return false;
  });
  // let posNew: number = 0;
  // const indexNew = newPaths.findIndex(([visited, dir], i) => {
  //   if (isVisited(visited, x, y)) {
  //     posNew = i;
  //     return true;
  //   }
  //   return false;
  // });
  if (index === -1) return true; //&& indexNew === -1
  if (
    index !== -1 &&
    getPositionCost(paths[index][0].slice(0, pos + 1)) >=
      getPositionCost(currPath) + points
  ) {
    paths.splice(index, 1);
    isShorter = true;
  }
  // if (
  //   indexNew !== -1 &&
  //   getPositionCost(newPaths[indexNew][0].slice(0, posNew + 1)) >=
  //     getPositionCost(currPath) + points
  // ) {
  //   newPaths.splice(indexNew, 1);
  //   isShorter = true;
  // }
  return isShorter;
}

async function readfile() {
  const file = Bun.file("input.txt");
  return (await file.text()).split("\n");
}

main();
