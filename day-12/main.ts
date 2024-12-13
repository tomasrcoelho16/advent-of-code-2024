const visited: [number, number][] = [];

const neighbours = [
  [0, -1],
  [0, 1],
  [1, 0],
  [-1, 0],
];

async function main() {
  const grid: string[] = await readfile();
  let total: number = 0;
  for (const [y, line] of grid.entries()) {
    for (const [x, letter] of line.split("").entries()) {
      const [area, perimeter] = getGarden(x, y, grid, letter);
      total += area * perimeter;
    }
  }
  console.log(total);
}

const isVisited = (x: number, y: number) =>
  visited.some((el) => el[0] === x && el[1] === y);

function getGarden(
  x: number,
  y: number,
  grid: string[],
  val: string,
): [number, number] {
  if (isVisited(x, y)) return [0, 0];
  visited.push([x, y]);
  let [area, perimeter] = [1, 0];
  for (const [x_inc, y_inc] of neighbours) {
    if (grid[y + y_inc]?.[x + x_inc] === val) {
      const [area1, perimeter1] = getGarden(x + x_inc, y + y_inc, grid, val);
      area += area1;
      perimeter += perimeter1;
    } else perimeter += 1;
  }
  return [area, perimeter];
}

async function readfile() {
  const file = Bun.file("test.txt");
  return (await file.text()).split("\n");
}

main();
