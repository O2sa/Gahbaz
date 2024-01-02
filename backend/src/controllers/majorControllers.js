const { StatusCodes } = require("http-status-codes");
const Major = require("../models/Major");
const Semester = require("../models/SemesterTemp");

const getMajor = async (req, res) => {
  const majorId = req.params.majorId;
  const major = await Major.find({ _id: majorId });

  res.status(StatusCodes.OK).json({ major });
};

const getAllCollageMajors = async (req, res) => {
  const collageId = req.params.collageId;
  const majors = await Major.find({ collage: collageId });
  console.log(req.params.collageId);

  res.status(StatusCodes.OK).json({ majors, count: majors.length });
};

const addMajor = async (req, res) => {
  const { semestersNum, major } = req.body;
  console.log(semestersNum, major);

  const newMajor = await Major.create(major);

  for (var s = 0; s < semestersNum; s++) {
    var newSemester = {
      name: `semester ${s + 1}, ${newMajor.name}`,
      index: s + 1,
      major: newMajor._id,
    };

    const semester = Semester.create(newSemester);
    console.log(newMajor, semester);
  }

  // Save the parent document
  // newMajor.save((err, savedParent) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log("Parent document with new item:", savedParent);
  //   }
  // });

  res.status(StatusCodes.OK).json(newMajor);
};

const updateMajor = async (req, res) => {};

const deleteMajor = async (req, res) => {
  const mjId = req.params.majorId;
  const deletedMajor = await Major.findOne({ _id: mjId });
  await deleteMajor.remove();
  res.status(StatusCodes.OK).json(deletedMajor);
};

const getMajorSemesters = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const addSemester = async (req, res) => {
  // const major=await Major.create(req.body)

  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

module.exports = {
  deleteMajor,
  getMajor,
  addMajor,
  updateMajor,
  getMajorSemesters,
  getAllCollageMajors,
};
