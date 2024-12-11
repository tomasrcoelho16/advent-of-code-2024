const antinodes: number[][] = [];

let MAP_WIDTH: number;
let MAP_HEIGHT: number;
let GRID_SPLIT: string[];

async function main() {
  const grid = await readfile();
  GRID_SPLIT = grid.split("\n");

  MAP_HEIGHT = GRID_SPLIT.length;
  MAP_WIDTH = GRID_SPLIT[0].length + 1;

  const nodes = [
    ...new Set(grid.split("").filter((ant) => ant !== "." && ant !== "\n")),
  ];

  for (const node of nodes) {
    getAntinodes(grid, node);
  }
  console.log(antinodes.length);
}

const alreadyInAntinodes = (x: number, y: number) =>
  antinodes.some((el) => el[0] === x && el[1] === y);

function addToAntinodes(
  x: number,
  y: number,
  x_offset: number,
  y_offset: number,
) {
  let [curr_x, curr_y] = [x + x_offset, y + y_offset];
  while (GRID_SPLIT[curr_y]?.[curr_x]) {
    if (x_offset === 0 && y_offset === 0) {
      if (!alreadyInAntinodes(curr_x, curr_y)) antinodes.push([curr_x, curr_y]);
      break;
    }
    if (!alreadyInAntinodes(curr_x, curr_y)) antinodes.push([curr_x, curr_y]);
    curr_x += x_offset;
    curr_y += y_offset;
  }
}

function getAntinodes(grid: string, node: string) {
  const nodePos: number[][] = [];
  let pos = -1;
  while ((pos = grid.indexOf(node, pos + 1)) >= 0) {
    nodePos.push([Math.floor(pos % MAP_WIDTH), Math.floor(pos / MAP_WIDTH)]);
  }
  for (let i = 0; i < nodePos.length; i++) {
    addToAntinodes(nodePos[i][0], nodePos[i][1], 0, 0);
    for (let j = i + 1; j < nodePos.length; j++) {
      const first = nodePos[i];
      const second = nodePos[j];
      const [x_diff, y_diff] = [second[0] - first[0], second[1] - first[1]];
      addToAntinodes(first[0], first[1], x_diff * -1, y_diff * -1);
      addToAntinodes(second[0], second[1], x_diff, y_diff);
    }
  }
}

async function readfile(): Promise<string> {
  const file = Bun.file("input.txt");
  return await file.text();
}

main();
