interface Pair {
  [key: number]: number[];
}

async function main() {
  const [rules, updates] = await readfile();
  const pairs: Pair = getpairs(rules);
  const uptCnt = updatesCount(updates, pairs);
  console.log(uptCnt);
}

function getpairs(rules: string): Pair {
  const pairs: Pair = {};
  for (const rule of rules.split("\n")) {
    const [firstpage, secondpage] = rule.split("|");
    pairs[+firstpage] ||= [];
    pairs[+firstpage].push(+secondpage);
  }
  return pairs;
}

function updatesCount(updates: string, pairs: Pair): number {
  let cnt = 0;
  for (const update of updates.split("\n")) {
    const curr = update.split(",");
    if (!checkUpdate(curr, pairs)[0]) cnt += correctUpdate(curr, pairs);
  }
  return cnt;
}

//Part 2
function correctUpdate(update: string[], pairs: Pair): number {
  let result: Boolean;

  do {
    const [isOrdered, x, y] = checkUpdate(update, pairs);
    result = isOrdered;

    if (result) break;
    const aux = update[x];
    update[x] = update[y];
    update[y] = aux;
  } while (!result);

  return +update[Math.floor(update.length / 2)];
}

function checkUpdate(update: string[], pairs: Pair): [Boolean, number, number] {
  let uptOrdered: Boolean = true;
  let errPosFirst = 0;
  let errPosSecond = 0;
  update.forEach((nmb, i, arr) => {
    for (let j = 0; j < i; j++) {
      if (pairs[+nmb]?.includes(+arr[j])) {
        errPosFirst = j;
        errPosSecond = i;
        uptOrdered = false;
        break;
      }
    }
  });
  return [uptOrdered, errPosFirst, errPosSecond];
}

async function readfile() {
  const file = Bun.file("input.txt");
  const parts: string[] = (await file.text()).split("\n\n");
  return parts;
}

main();
