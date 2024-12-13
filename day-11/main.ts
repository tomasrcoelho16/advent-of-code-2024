function main(input: string) {
  let stones = input.split(" ");
  const successor = { "0": "1" };
  let totalStones = stones.length;
  let blinks = 0;
  while (blinks < 45) {
    const newStones: string[] = [];
    for (const stone of stones) {
      if (stone in successor) {
        newStones.push(...successor[stone]);
        continue;
      }
      if (stone.length % 2 === 0)
        successor[stone] = [
          stone.slice(0, stone.length / 2),
          String(+stone.slice(stone.length / 2)),
        ];
      else successor[stone] = [String(+stone * 2024)];
      newStones.push(...successor[stone]);
    }
    totalStones += newStones.length - stones.length;
    stones = newStones;
    blinks++;
  }
  return totalStones;
}

console.log(main("92 0 286041 8034 34394 795 8 2051489"));
