const directions = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};
const dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const visited: number[][] = [];

let TOTAL_POS: number;

async function main() {
  const whole_map: string = await readfile();
  const initial_pos = whole_map.indexOf("^");
  const map = whole_map.split("\n");
  let [guard_x, guard_y] = [
    Math.floor(initial_pos % (map[0].length + 1)),
    Math.floor(initial_pos / (map[0].length + 1)),
  ];
  TOTAL_POS = map.length * map[0].length;
  console.log(TOTAL_POS);
  let totalCovered = turnCover(guard_x, guard_y, map);
  let obstructions = visited.length;
  // if (alreadyInVisited(guard_x, guard_y)) obstructions--;
  console.log(visited.length);
  console.log("Guard covers: " + totalCovered);
  console.log(
    "There are " +
      obstructions +
      " places to put an obstruction to loop the guard",
  );
}

const alreadyInVisited = (x: number, y: number) =>
  visited.some((el) => el[0] === x && el[1] === y);

function turnCover(x: number, y: number, map: string[]): number {
  const initial_pos = [x, y];
  let totalCovered: number = 0;
  let currDir: number = 0;
  let [x_increment, y_increment] = dirs[currDir];
  while (map[y] && map[y][x]) {
    if (map[y][x] === "#") {
      currDir = (currDir + 1) % dirs.length;
      y -= y_increment;
      x -= x_increment;
      [x_increment, y_increment] = dirs[currDir];
      continue;
    }
    if (map[y][x] !== "#") {
      if (
        map[y + y_increment]?.[x + x_increment] &&
        map[y + y_increment][x + x_increment] !== "#"
      ) {
        let clonedArray = [...map];
        let newLine = clonedArray[y + y_increment].split("");
        newLine[x + x_increment] = "#";
        clonedArray[y + y_increment] = newLine.join("");
        let aux = check_loops(initial_pos[0], initial_pos[1], clonedArray, 0);
        if (!alreadyInVisited(x + x_increment, y + y_increment) && aux === 1) {
          visited.push([x + x_increment, y + y_increment]);
        }
      }
    }
    if (map[y][x] !== "X") totalCovered++;
    let newLine = map[y].split("");
    newLine[x] = "X";
    map[y] = newLine.join("");
    x += x_increment;
    y += y_increment;
  }
  return totalCovered;
}

function check_loops(x: number, y: number, map: string[], dir: number): number {
  // console.log(x, y);
  // console.log(
  //   `Position -> x: ${x}, y: ${y} with dir: ${dir} and value ${map[y][x]}`,
  // );
  let totalCovered: number = 0;
  let lastCovered: number = 0;
  const initial_pos = [x, y, dir];
  let [x_increment, y_increment] = dirs[dir];
  let count: number = 0;
  while (map[y] && map[y][x]) {
    if (map[y][x] === "#") {
      dir = (dir + 1) % dirs.length;
      x -= x_increment;
      y -= y_increment;
      [x_increment, y_increment] = dirs[dir];
      continue;
    }
    if (map[y][x] !== "X") totalCovered++;
    let newLine = map[y].split("");
    newLine[x] = "X";
    map[y] = newLine.join("");
    x += x_increment;
    y += y_increment;
    if (count >= TOTAL_POS) {
      if (lastCovered === totalCovered) {
        return 1;
      }
      lastCovered = totalCovered;
      initial_pos[0] = x;
      initial_pos[1] = y;
      count = 0;
    }
    count++;
  }
  return 0;
}

async function readfile(): Promise<string> {
  const file = Bun.file("input.txt");
  return await file.text();
}

main();
