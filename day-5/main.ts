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
    const [alreadyOrdered, score] = checkUpdate(curr, pairs);
    if (!alreadyOrdered) cnt += score;
  }
  return cnt;
}

function checkUpdate(update: string[], pairs: Pair): [Boolean, number] {
  let count = -1;
  let firstPos = 0;
  let secondPos = 0;
  while (true) {
    let uptOrdered: Boolean = true;
    count++;
    update.forEach((nmb, i, arr) => {
      for (let j = 0; j < i; j++) {
        if (pairs[+nmb]?.includes(+arr[j])) {
          firstPos = j;
          secondPos = i;
          uptOrdered = false;
          break;
        }
      }
    });
    if (uptOrdered) break;
    [update[firstPos], update[secondPos]] = [
      update[secondPos],
      update[firstPos],
    ];
  }
  return [count === 0, +update[Math.floor(update.length / 2)]];
}

async function readfile() {
  const file = Bun.file("input.txt");
  const parts: string[] = (await file.text()).split("\n\n");
  return parts;
}

main();
