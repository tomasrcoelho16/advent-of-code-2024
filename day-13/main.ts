async function main() {
  const prizes = await readfile();
  const re = new RegExp(
    /Button A: X["+"](?<firstX>[0-9]*), Y["+"](?<firstY>[0-9]*)\nButton B: X["+"](?<secondX>[0-9]*), Y["+"](?<secondY>[0-9]*)\nPrize: X=(?<prizeX>[0-9]*), Y=(?<prizeY>[0-9]*)/,
  );
  let total = 0;
  for (const prize of prizes) {
    const values = re.exec(prize)!.groups || [];
    total += combination(Object.values(values).map((e) => +e));
  }
  console.log(total);
}

function combination(vals: number[]): number {
  let [fstX, fstY, secX, secY, prizeX, prizeY] = vals;
  prizeX += 10000000000000;
  prizeY += 10000000000000;
  const y = +(
    (prizeX - (fstX * prizeY) / fstY) /
    ((-secY * fstX) / fstY + secX)
  ).toFixed(3);
  const x = (prizeY - secY * y) / fstY;
  if (x % 1 === 0) return 3 * x + y;
  return 0;
}

async function readfile() {
  const file = Bun.file("input.txt");
  return (await file.text()).split("\n\n");
}

main();
