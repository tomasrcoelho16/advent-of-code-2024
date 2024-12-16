const WIDTH = 100;
const HEIGHT = 102;
const quadrants = [0, 0, 0, 0, 0];
let robotsArr: [number, number, number, number][] = [];
const grid: string[] = [];

for (let i = 0; i < HEIGHT + 1; i++) grid.push(".".repeat(WIDTH + 1));

async function main() {
  const robots = await readfile();
  const re = new RegExp(
    /p=(?<x>\d*),(?<y>\d*) *v=(?<velx>-?\d*),(?<vely>-?\d*)/,
  );
  for (const robot of robots) {
    const { x, y, velx, vely } = re.exec(robot)!.groups;
    robotsArr.push([+x, +y, +velx, +vely]);
    changeGridValue(+x, +y);
  }
  let i = 0;
  while (true) {
    robotsArr = robotsArr.map((robot) => nextPos(...robot));
    if (isTree()) {
      console.log(i, "---------------------------------------------");
      console.log(grid.join("\n"));
    }
    i++;
  }
  console.log(quadrants);
  console.log(quadrants.slice(0, 4).reduce((prev, curr) => curr * prev, 1));
}

function nextPos(
  x: number,
  y: number,
  velx: number,
  vely: number,
): [number, number, number, number] {
  changeGridValue(x, y, -1);
  let newLine = grid[y].split("");
  newLine[x] = ".";
  grid[y] = newLine.join("");
  if (x + velx > WIDTH) x = x + velx - WIDTH - 1;
  else if (x + velx < 0) x = WIDTH + x + velx + 1;
  else x += velx;
  //-------------------------------
  if (y + vely > HEIGHT) y = y + vely - HEIGHT - 1;
  else if (y + vely < 0) y = HEIGHT + y + vely + 1;
  else y += vely;
  changeGridValue(x, y);
  newLine = grid[y].split("");
  newLine[x] = "#";
  grid[y] = newLine.join("");
  return [x, y, velx, vely];
}

function changeGridValue(x: number, y: number, val: number = 1) {
  if (x === WIDTH / 2) {
    quadrants[4] += val;
    return;
  }
  if (y === HEIGHT / 2) {
    return;
  }
  let pos = 0;
  if (y > HEIGHT / 2) pos += 2;
  if (x > WIDTH / 2) pos += 1;
  quadrants[pos] += val;
}

function isTree() {
  return grid.some((el) => el.split("#").length >= 25);
}

async function readfile() {
  const file = Bun.file("input.txt");
  return (await file.text()).split("\n");
}

main();
