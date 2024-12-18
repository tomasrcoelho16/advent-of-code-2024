async function main() {
  let machine: string = await readfile();
  const re = new RegExp(
    /[a-zA-Z]* *A: *(?<regA>[0-9]*)\n[a-zA-Z]* *B: *(?<regB>[0-9]*)\n[a-zA-Z]* *C: *(?<regC>[0-9]*)\n\n[a-zA-Z]*: (?<program>([0-9]||,)*)/,
  );
  const { program: programStr, ...registers } = re.exec(machine)!.groups;
  const program = programStr.split(",").map((val: string) => +val);
  let output: string;
  let i = 1;
  do {
    output = exec_program(program, i, 0, 0);
    i++;
  } while (programStr !== output);
  console.log(i - 1);
}

function exec_program(
  program: number[],
  regA: number,
  regB: number,
  regC: number,
) {
  const output: string[] = [];
  let inc = 2;
  let i = 0;
  function value(nmb: number, isCombo = false): number {
    if (!isCombo || nmb <= 3) return nmb;
    if (nmb === 4) return regA;
    if (nmb === 5) return regB;
    return regC;
  }

  while (i < program.length) {
    switch (program[i]) {
      case 0:
        regA = Math.floor(regA / Math.pow(2, value(program[i + 1], true)));
        break;
      case 1:
        regB ^= value(program[i + 1]);
        break;
      case 2:
        regB = value(program[i + 1], true) % 8;
        break;
      case 3:
        if (regA === 0) break;
        i = value(program[i + 1]) - 2;
        break;
      case 4:
        regB ^= regC;
        break;
      case 5:
        output.push(String(value(program[i + 1], true) % 8));
        break;
      case 6:
        regB = Math.floor(regA / Math.pow(2, value(program[i + 1], true)));
        break;
      case 7:
        regC = Math.floor(regA / Math.pow(2, value(program[i + 1], true)));
        break;
    }
    i += inc;
  }
  return output.join(",");
}

async function readfile() {
  const file = Bun.file("input.txt");
  return await file.text();
}

main();
