async function main() {
  const lvls = await readfile();
  let safeReports = 0;
  for (const level of lvls) {
    safeReports += isSafeTwo(level);
  }
  console.log(safeReports);
}

function isSafeOne(level: string): number {
  const nmbs: string[] = level.split(" ");
  const dir = +nmbs[0] - +nmbs[1] > 0;
  for (let i = 0; i < nmbs.length - 1; i++) {
    const curr = +nmbs[i] - +nmbs[i + 1];
    if (Math.abs(curr) <= 3 && Math.abs(curr) > 0 && curr > 0 === dir) continue;
    return 0;
  }
  return 1;
}

function isSafeTwo(level: string): number {
  if (isSafeOne(level) === 1) return 1;
  const nmbs: string[] = level.split(" ");
  for (let i = 0; i < nmbs.length; i++) {
    const removed = nmbs.splice(i, 1)[0];
    if (isSafeOne(nmbs.join(" "))) return 1;
    nmbs.splice(i, 0, removed);
  }
  return 0;
}

async function readfile() {
  let file = Bun.file("input.txt");
  return (await file.text()).split("\n");
}

main();
