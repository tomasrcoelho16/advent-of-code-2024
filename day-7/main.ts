async function main() {
  const lines = await readfile();
  let totalCalibration: number = 0;
  for (const line of lines) totalCalibration += calibrationResult(line);
  console.log(totalCalibration);
}

function calibrationResult(line: string): number {
  const [res, ...rest] = line.split(" ");
  const resNmb = Number.parseInt(res);
  let values: number[] = [+rest[0]];
  for (let i = 1; i < rest.length; i++) {
    const newValues: number[] = [];
    for (const value of values) {
      newValues.push(+rest[i] * value);
      newValues.push(+rest[i] + value);
      newValues.push(+(value + rest[i])); // added for part 2
    }
    values = newValues;
  }
  return values.includes(resNmb) ? resNmb : 0;
}

async function readfile(): Promise<string[]> {
  const file = Bun.file("input.txt");
  return (await file.text()).split("\n");
}

main();
