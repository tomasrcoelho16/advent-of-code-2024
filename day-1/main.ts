interface Pair {
  [key: number]: number;
}

async function main() {
  const parts: string[] = await readFile();
  const [leftArr, rightArr] = getArrays(parts);
  let sim = 0;
  //- 1
  // rightArr.forEach((nmb, i) => (dif += Math.abs(nmb - leftArr[i])));
  //- 2
  leftArr.forEach((nmb) => (sim += rightArr[nmb] ? nmb * rightArr[nmb] : 0));
  console.log(sim);
}

function getArrays(parts: string[]): [number[], Pair] {
  const re = new RegExp(/(?<left>[0-9]*)   (?<right>[0-9]*)/);
  let leftArr: number[] = [];
  let rightArr: Pair = {};
  for (const part of parts) {
    const nmbs = re.exec(part)?.groups;
    if (nmbs) {
      leftArr.push(+nmbs.left);
      rightArr[+nmbs.right] ||= 0;
      rightArr[+nmbs.right]++;
    }
  }

  return [leftArr, rightArr];
}

async function readFile(): Promise<string[]> {
  let file = Bun.file("input.txt");
  let parts = (await file.text()).split("\n");
  return parts;
}

main();
