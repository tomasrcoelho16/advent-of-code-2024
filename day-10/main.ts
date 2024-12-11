let visited: [number, number][] = [];

async function main() {
  const grid = await readfile();
  let trailheads_total = 0;
  for (const [i, val] of grid.entries()) {
    let pos = -1;
    while ((pos = val.indexOf("0", pos + 1)) >= 0) {
      visited = [];
      trailheads_total += trailheads(pos, i, 0, grid);
    }
  }
  console.log(trailheads_total);
}

function trailheads(x: number, y: number, val: number, grid: string[]) {
  let total = 0;
  if (+grid[y - 1]?.[x] === val + 1) {
    if (val === 8) total += 1;
    total += trailheads(x, y - 1, val + 1, grid);
  }
  if (+grid[y + 1]?.[x] === val + 1) {
    if (val === 8) total += 1;
    total += trailheads(x, y + 1, val + 1, grid);
  }
  if (+grid[y]?.[x - 1] === val + 1) {
    if (val === 8) total += 1;
    total += trailheads(x - 1, y, val + 1, grid);
  }
  if (+grid[y]?.[x + 1] === val + 1) {
    if (val === 8) total += 1;
    total += trailheads(x + 1, y, val + 1, grid);
  }
  return total;
}

const isVisited = (x: number, y: number) =>
  visited.some((el) => el[0] === x && el[1] === y);

async function readfile() {
  const file = Bun.file("input.txt");
  return (await file.text()).split("\n");
}

main();
