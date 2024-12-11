async function main() {
  const input = await readfile();
  let blocks: [string, number][] = [];
  input.split("").forEach((nmb, i) => {
    if (+nmb === 0) return;
    blocks.push([
      i % 2 === 0 ? String(i / 2).repeat(+nmb) : ".".repeat(+nmb),
      +nmb,
    ]);
  });
  let aux = [...blocks];
  for (let i = blocks.length - 1; i > -1; i--) {
    const [currValue, currLength] = blocks[i];
    const curr = blocks[i];
    if (currValue.includes(".")) continue;
    const target: number = aux.findIndex(
      ([val, length]) => val.includes(".") && length >= currLength,
    );
    if (target >= 0) {
      const replacer: number = aux.findIndex(
        ([val, length]) => val === currValue && length === currLength,
      );
      if (target > replacer) continue;
      aux[replacer] = [".".repeat(currLength), currLength];
      aux = [
        ...aux.slice(0, target),
        curr,
        [".".repeat(aux[target][1] - currLength), aux[target][1] - currLength],
        ...aux.slice(target + 1),
      ];
    }
  }

  const result: number[] = [];
  for (let [val, len] of aux) {
    const valSize = val.length / len;
    while (len > 0) {
      len--;
      if (val.includes(".")) {
        result.push(0);
        continue;
      }
      result.push(+val.split("").splice(0, valSize).join(""));
    }
  }

  console.log(
    result.reduce((prev, curr, i) => {
      return prev + curr * i;
    }, 0),
  );
}

async function readfile(): Promise<string> {
  const file = Bun.file("input.txt");
  return await file.text();
}

main();
