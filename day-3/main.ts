async function main() {
  let text: string = await readfile();
  const mul = multiplicationsTwo(text);
  console.log(mul);
}

function multiplications(text: string): number {
  const re = new RegExp(/mul['('](?<first>[0-9]*),(?<second>[0-9]*)[')']/);
  let nextMult = re.exec(text);
  let mul = 0;
  while (nextMult) {
    const parcels = nextMult.groups;
    mul += parcels ? +parcels.first * +parcels.second : 0;
    text = text.slice(nextMult.index);
    text = text.slice(text.indexOf(")") + 1);
    nextMult = re.exec(text);
  }
  return mul;
}

function multiplicationsTwo(text: string): number {
  const re = new RegExp(
    /(mul['('](?<first>[0-9]*),(?<second>[0-9]*)[')'])|(?<permission>do(n't)?['('][')'])/,
  );
  let nextCmd = re.exec(text);
  let enabled = true;
  let mul = 0;
  while (nextCmd) {
    const parcels = nextCmd.groups;
    if (parcels?.permission) enabled = !parcels.permission.includes("n't");
    else if (enabled) mul += parcels ? +parcels.first * +parcels.second : 0;
    text = text.slice(nextCmd.index);
    text = text.slice(text.indexOf(")") + 1);
    nextCmd = re.exec(text);
  }
  return mul;
}

async function readfile() {
  const file = Bun.file("input.txt");
  return await file.text();
}

main();
