// const z = prompt(`Press to continue \n `);
// console.log(z);

process.stdin.setRawMode(true);
process.stdin.on("data", (e) => {
  console.log(e[2]);
  if (e[0] == 3) {
    process.exit(0);
    console.log("Spacebar pressed");
    process.stdin.setRawMode(false);
  }
});
