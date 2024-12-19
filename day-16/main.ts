const END_TILE = "E";
const EMPTY_TILE = ".";

enum Direction {
  HORIZONTAL,
  VERTICAL,
}

type Possibility = [x: number, y: number, points: number, dir: number];

const dirs = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1],
];

let init_dir = Direction.HORIZONTAL;
const finished_paths: number[] = [];
let queue: Possibility[] = [];
let grid: string[];

async function main() {
  grid = await readfile();
  const [init_x, init_y] = [1, grid[0].length - 2];
  queue.push([init_x, init_y, 0, init_dir]);
  while (queue.length !== 0) {
    nextpaths(queue[0]);
    queue.splice(0, 1);
    queue = queue.sort((a, b) => a[2] - b[2]);
  }
  console.log(finished_paths);
  console.log([...new Set(finished_paths)].sort((a, b) => a - b));
}

function nextpaths(path: Possibility): void {
  const [x, y, points, dir] = path;

  for (const [x_dir, y_dir] of dirs) {
    const newDirection =
      x_dir === 0 ? Direction.VERTICAL : Direction.HORIZONTAL;

    const newPoints = points + (dir === newDirection ? 1 : 1001);

    //Check if next position is the final
    if (grid[y + y_dir][x + x_dir] === END_TILE) {
      finished_paths.push(newPoints);
      continue;
    }

    // Check if possible to follow new path
    if (grid[y + y_dir][x + x_dir] === EMPTY_TILE) {
      changeMap(x + x_dir, y + y_dir);
      queue.push([x + x_dir, y + y_dir, newPoints, newDirection]);
    }
  }
}

function changeMap(x: number, y: number) {
  const newLine = grid[y].split("");
  newLine[x] = "#";
  grid[y] = newLine.join("");
}

async function readfile() {
  const file = Bun.file("input.txt");
  return (await file.text()).split("\n");
}

main();
