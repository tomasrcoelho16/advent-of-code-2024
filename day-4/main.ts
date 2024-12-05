async function main() {
  const lines: string[] = await readfile();
  let total_xmas = 0;
  console.log(xmas_count_one(lines, "XMAS"));
  console.log(xmas_count_two(lines, "MAS"));
}

function xmas_count_one(lines: string[], target: string): number {
  let total: number = 0;
  for (const [i, line] of lines.entries()) {
    let pos = -1;
    while ((pos = line.indexOf("X", pos + 1)) >= 0) {
      total += line.slice(pos, pos + 4) === target ? 1 : 0;
      total += reverseStr(line.slice(pos - 3, pos + 1)) === target ? 1 : 0;
      for (let j = -1; j < 2; j++) {
        if (neighbours(lines.slice(i - 3, i + 1), pos, 3, j, -1, target))
          total++;
        if (neighbours(lines.slice(i, i + 4), pos, 0, j, 1, target)) total++;
      }
    }
  }
  return total;
}

function xmas_count_two(lines: string[], target: string): number {
  let total: number = 0;
  for (const [i, line] of lines.entries()) {
    let pos = -1;
    while ((pos = line.indexOf("A", pos + 1)) >= 0) {
      const neighborLines = lines.slice(i - 1, i + 2);
      if (
        neighbours(neighborLines, pos - 1, undefined, 1, undefined, target) &&
        neighbours(neighborLines, pos + 1, undefined, -1, undefined, target)
      )
        total++;
    }
  }
  return total;
}

function neighbours(
  neighbours: string[],
  pos: number,
  i: number = 0,
  hor: number,
  vert: number = 1,
  target: string,
): Boolean {
  let match: string = "";
  for (let j = 0; j < neighbours.length; j++) {
    if (!neighbours[i + vert * j]) return false;
    match += neighbours[i + vert * j][pos + hor * j];
  }
  return match === target || reverseStr(match) === target;
}

const reverseStr = (str: string) => str.split("").reverse().join("");

async function readfile(): Promise<string[]> {
  const file = Bun.file("input.txt");
  return (await file.text()).split("\n");
}

main();
