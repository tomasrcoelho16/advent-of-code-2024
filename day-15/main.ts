let map: string[];
let x: number;
let y: number;
const boxChars = ["[", "]"]; // Part 2

enum direction {
  LEFT = "<",
  RIGHT = ">",
  UP = "^",
  DOWN = "v",
}

async function main() {
  const [map_whole, moves] = await readfile();
  const raw_pos = map_whole.indexOf("@");
  map = map_whole.split("\n");
  [x, y] = [
    Math.floor(raw_pos % (map[0].length + 1)),
    Math.floor(raw_pos / (map[0].length + 1)),
  ];
  transformMap(); //Part 2
  x = 2 * x; //Part 2
  console.log(map.join("\n"));

  let boxes_count_start = 0;
  for (const [i, line] of map.entries()) {
    let pos = -1;
    while ((pos = line.indexOf("[", pos + 1)) >= 0) {
      boxes_count_start++;
    }
  }

  for (const moveStr of moves) {
    // while (true) {
    // let moveStr;
    // process.stdin.setRawMode(true);
    // process.stdin.on("data", (e) => {
    //   console.log(e[2]);
    //   if (e[0] == 3) process.exit(0);
    switch (
      moveStr //e[2]
    ) {
      case direction.LEFT: //68
        if (move(x, y, [-1, 0])) x--;
        break;
      case direction.RIGHT: //67
        if (move(x, y, [1, 0])) x++;
        break;
      case direction.UP: //65
        if (move(x, y, [0, -1])) y--;
        break;
      case direction.DOWN: //66
        if (move(x, y, [0, 1])) y++;
        break;
    }
    // console.log(map.join("\n"));
    // });
  }

  console.log(map.join("\n"));

  let total = 0;
  let boxes_count = 0;
  for (const [i, line] of map.entries()) {
    let pos = -1;
    while ((pos = line.indexOf("[", pos + 2)) >= 0) {
      total += 100 * i + pos;
      boxes_count++;
    }
  }

  console.log(total, boxes_count);
}

function move(x: number, y: number, dir: number[]): Boolean {
  const [dir_x, dir_y] = dir;
  const char: string = map[y][x];
  if (map[y + dir_y][x + dir_x] === "#") return false;
  // if (map[y + dir_y][x + dir_x] === "O" && !move(x + dir_x, y + dir_y, dir))
  //   // PART 1
  //   return false;
  if (
    boxChars.includes(map[y + dir_y][x + dir_x]) &&
    !moveBox(x + dir_x, y + dir_y, dir)
  )
    return false;
  changeMapValue(x, y, ".");
  changeMapValue(x + dir_x, y + dir_y, char);
  return true;
}

// Part 2
function moveBox(x: number, y: number, dir: number[]): Boolean {
  const [dir_x, dir_y] = dir;
  if (map[y][x] === "]") x--;
  if (!canMoveBox(x, y, dir)) return false;
  if (
    (boxChars.includes(map[y + dir_y][x + dir_x]) && dir_x != 1) ||
    (boxChars.includes(map[y + dir_y][x + dir_x + 1]) && dir_x != -1)
  ) {
    if (dir_x === 1 && !moveBox(x + dir_x + 1, y + dir_y, dir)) return false;
    if (dir_x === -1 && !moveBox(x + dir_x, y, dir)) return false;
    if (
      dir_x === 0 &&
      canMoveBox(x + 1, y + dir_y, dir) &&
      canMoveBox(x, y + dir_y, dir)
    ) {
      if (boxChars.includes(map[y + dir_y][x + dir_x]))
        moveBox(x, y + dir_y, dir);
      if (map[y + dir_y][x + dir_x + 1] === "[") moveBox(x + 1, y + dir_y, dir);
    } else if (
      dir_x === 0 &&
      (!canMoveBox(x + 1, y + dir_y, dir) || !canMoveBox(x, y + dir_y, dir))
    )
      return false;
  }
  changeMapValue(x, y, ".");
  changeMapValue(x + 1, y, ".");
  changeMapValue(x + dir_x, y + dir_y, "[");
  changeMapValue(x + dir_x + 1, y + dir_y, "]");
  return true;
}

function canMoveBox(x: number, y: number, dir: number[]) {
  const [dir_x, dir_y] = dir;
  if (map[y][x] === "]") x--;
  if (!boxChars.includes(map[y][x])) return true;
  if (
    map[y + dir_y][x + dir_x] === "#" ||
    map[y + dir_y][x + dir_x + 1] === "#"
  )
    return false;
  if (
    dir_x === 0 &&
    (boxChars.includes(map[y + dir_y][x + dir_x]) ||
      boxChars.includes(map[y + dir_y][x + dir_x + 1]))
  ) {
    if (
      !canMoveBox(x + dir_x, y + dir_y, dir) ||
      !canMoveBox(x + dir_x + 1, y + dir_y, dir)
    )
      return false;
  }
  return true;
}

function changeMapValue(x: number, y: number, newVal: string) {
  const newLine = map[y].split("");
  newLine[x] = newVal;
  map[y] = newLine.join("");
}

function transformMap() {
  const newMap = map.map((line) =>
    line
      .split("")
      .map((char) => {
        if (char === "O") return "[]";
        if (char === "@") return "@.";
        return char.repeat(2);
      })
      .join(""),
  );
  map = newMap;
}

async function readfile(): Promise<string> {
  const file = Bun.file("input.txt");
  return (await file.text()).split("\n\n");
}

main();
