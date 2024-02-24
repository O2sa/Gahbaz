const { StatusCodes } = require("http-status-codes");
const Major = require("../models/Major");
const SemesterTemp = require("../models/SemesterTemp");

const getMajor = async (req, res) => {
  const id = req.params.id;
  const item = await Major.find({ _id: id });

  res.status(StatusCodes.OK).json({ item });
};

const getCollageMajors = async (req, res) => {
  const id = req.params.id;
  const majors = await Major.find({ collage: id });
  // console.log(req.params.collageId);

  res.status(StatusCodes.OK).json({ majors, count: majors.length });
};

const createMajor = async (req, res) => {
  const { semestersNum, major } = req.body;
  console.log(semestersNum, major);

  const newMajor = await Major.create(major);

  for (var s = 0; s < semestersNum; s++) {
    const newSemester = await SemesterTemp.create({
      name: `semester ${s + 1}, ${newMajor.name}`,
      major: newMajor.id,
      index: s + 1,
    });

    newMajor.semesterTemplates.push(newSemester._id);
    await newMajor.save();

    console.log(newMajor, newSemester);
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

const updateMajor = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const item = await Subject.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.OK).json({ item });
};

const deleteMajor = async (req, res) => {
  const id = req.params.id;
  const major = await Major.findOneAndDelete({ _id: id });
  const deletedSems = await SemesterTemp.deleteMany({ major: major.id });

  if (!major) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Major not found" });
  }

  // Call remove() on the instance of the Major model

  // You can respond with the deleted Major
  res.status(StatusCodes.OK).json(major);
};

const addSemester = async (req, res) => {
  // const major=await Major.create(req.body)

  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

module.exports = {
  getMajor,
  getCollageMajors,
  createMajor,
  updateMajor,
  deleteMajor,
};
