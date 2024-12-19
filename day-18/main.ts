const CORRUPTED_BYTES_COUNT = 1024;
const MEMORY_SIDE_SIZE = 70;
const EMPTY_TILE = ".";
const END_TILE = "E";

const grid: string[] = [];

type Possibility = [visited: [number, number, number][]];

const dirs = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1],
];
const diagonals = [
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];

let finished = 0;
let paths: Possibility[] = [];
let newPaths: Possibility[] = [];

for (let i = 0; i <= MEMORY_SIDE_SIZE; i++)
  grid.push(".".repeat(MEMORY_SIDE_SIZE + 1));

async function main() {
  const corrupted_bytes = await readfile();
  for (let i = 0; i < CORRUPTED_BYTES_COUNT; i++) {
    const [x, y] = corrupted_bytes[i].split(",");
    changeMap(x, y, "#");
  }
  changeMap(String(MEMORY_SIDE_SIZE), String(MEMORY_SIDE_SIZE), "E");

  for (let i = CORRUPTED_BYTES_COUNT + 1; i < corrupted_bytes.length; i++) {
    const [x, y] = corrupted_bytes[i].split(",");
    changeMap(x, y, "#");
    finished = 0;
    paths = [];
    paths.push([[[0, 0, 0]]]);

    let isIsolated = true;
    for (const [dir_x, dir_y] of dirs) {
      if (grid[+y + dir_y]?.[+x + dir_x] === "#") {
        isIsolated = false;
        break;
      }
    }

    for (const [dir_x, dir_y] of diagonals) {
      if (grid[+y + dir_y]?.[+x + dir_x] === "#") {
        isIsolated = false;
        break;
      }
    }
    if (isIsolated) continue;

    while (paths.length !== 0) {
      newPaths = [];
      for (const path of paths) {
        const recent = nextpaths(path, grid);
        recent.length > 0 && newPaths.push(...recent);
      }
      if (finished !== 0) break;
      paths = newPaths
        .sort((a, b) => getPositionCost(a[0]) - getPositionCost(b[0]))
        .splice(0, 100);
    }
    if (finished === 0) {
      console.log("aqui", x, y);
      break;
    }
  }

  console.log(finished);
}

const isVisited = (arr: [number, number, number][], x: number, y: number) =>
  arr.some((el) => el[0] === x && el[1] === y);

function nextpaths(path: Possibility, grid: string[]): Possibility[] {
  const currNewPaths: Possibility[] = [];
  const [visited] = path;
  const [curr_x, curr_y, ...rest] = visited[visited.length - 1];

  for (const [x_dir, y_dir] of dirs) {
    //Check if next position is the final
    if (grid[+curr_y + y_dir]?.[+curr_x + x_dir] === END_TILE) {
      finished = getPositionCost(visited) + 1;
      continue;
    }

    // Check if possible to follow new path
    if (
      grid[+curr_y + y_dir]?.[+curr_x + x_dir] === EMPTY_TILE &&
      !isVisited(visited, +curr_x + x_dir, +curr_y + y_dir) &&
      isShortestPath(+curr_x + x_dir, +curr_y + y_dir, visited, 1)
    ) {
      currNewPaths.push([[...visited, [+curr_x + x_dir, +curr_y + y_dir, 1]]]);
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
): Boolean {
  let pos: number = 0;
  let isShorter: Boolean = false;
  const index = paths.findIndex(([visited], i) => {
    if (isVisited(visited, x, y)) {
      pos = i;
      return true;
    }
    return false;
  });
  let posNew: number = 0;
  const indexNew = newPaths.findIndex(([visited], i) => {
    if (isVisited(visited, x, y)) {
      posNew = i;
      return true;
    }
    return false;
  });
  if (index === -1 && indexNew === -1) return true; //&& indexNew === -1
  if (
    index !== -1 &&
    getPositionCost(paths[index][0].slice(0, pos + 1)) >=
      getPositionCost(currPath) + points
  ) {
    paths.splice(index, 1);
    isShorter = true;
  }
  if (
    indexNew !== -1 &&
    getPositionCost(newPaths[indexNew][0].slice(0, posNew + 1)) >=
      getPositionCost(currPath) + points
  ) {
    newPaths.splice(indexNew, 1);
    isShorter = true;
  }
  return isShorter;
}

function changeMap(x: string, y: string, char: string) {
  const newLine = grid[y].split("");
  newLine[x] = char;
  grid[y] = newLine.join("");
}

async function readfile(): Promise<string[]> {
  const file = Bun.file("input.txt");
  return (await file.text()).split("\n");
}

main();
