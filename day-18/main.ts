const CORRUPTED_BYTES_COUNT = 12;
const MEMORY_SIDE_SIZE = 6;
const EMPTY_TILE = ".";
const END_TILE = "E";

const grid: string[] = [];

type Possibility = [visited: [number, number][], points: number];

const dirs = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1],
];

let finished = 0;

for (let i = 0; i <= MEMORY_SIDE_SIZE; i++)
  grid.push(".".repeat(MEMORY_SIDE_SIZE + 1));

async function main() {
  const corrupted_bytes = await readfile();
  for (let i = 0; i < CORRUPTED_BYTES_COUNT; i++) {
    const [x, y] = corrupted_bytes[i].split(",");
    const newLine = grid[y].split("");
    newLine[x] = "#";
    grid[y] = newLine.join("");
  }
  const newLine = grid[MEMORY_SIDE_SIZE].split("");
  newLine[MEMORY_SIDE_SIZE] = "E";
  grid[MEMORY_SIDE_SIZE] = newLine.join("");
  console.log(grid.join("\n"));

  let paths: Possibility[] = [[[[0, 0]], 0]];
  while (paths.length !== 0) {
    const newPaths: Possibility[] = [];
    for (const path of paths) {
      const recent = nextpaths(path, grid);
      recent.length > 0 && newPaths.push(...recent);
    }
    if (finished !== 0) break;
    paths = newPaths;
  }
  console.log(finished);
}

const isVisited = (arr: [number, number][], x: number, y: number) =>
  arr.some((el) => el[0] === x && el[1] === y);

function nextpaths(path: Possibility, grid: string[]): Possibility[] {
  const newPaths: Possibility[] = [];
  const [visited, points] = path;
  const [curr_x, curr_y] = visited[visited.length - 1];

  for (const [x_dir, y_dir] of dirs) {
    const newPoints = points + 1;
    //Check if next position is the final
    if (grid[curr_y + y_dir]?.[curr_x + x_dir] === END_TILE) {
      finished = newPoints;
      continue;
    }

    // Check if possible to follow new path
    if (
      !isVisited(visited, curr_x + x_dir, curr_y + y_dir) &&
      grid[curr_y + y_dir]?.[curr_x + x_dir] === EMPTY_TILE
    ) {
      newPaths.push([
        [...visited, [curr_x + x_dir, curr_y + y_dir]],
        newPoints,
      ]);
    }
  }

  return newPaths;
}

async function readfile(): Promise<string[]> {
  const file = Bun.file("test.txt");
  return (await file.text()).split("\n");
}

main();
