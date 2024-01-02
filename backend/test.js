var sems = [];

for (var s = 0; s < 8; s++) {
  var newSemester = {
    name: `semester ${s + 1}`,
    index: sems.length + 1,
  };
  sems.push(newSemester)

  // newMajor.semesters.push(newSemester);
}
console.log(sems);


