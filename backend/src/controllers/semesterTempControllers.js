const { StatusCodes } = require("http-status-codes");
const SemesterTemp = require("../models/SemesterTemp");
const Major = require("../models/Major");

const getSemesterTemplate = async (req, res) => {
  const id = req.params.id;
  const SemesterTemp = await SemesterTemp.findById(id)

  res.status(StatusCodes.OK).json({ SemesterTemp });
};

const createSemesterTemplate = async (req, res) => {
  const collage = await Major.semesterTemplates.create(req.body);
  res.status(StatusCodes.CREATED).json(collage);
};

const updateSemesterTemplate = async (req, res) => {
  const id = req.params.id;

  const collage = await Major.semesterTemplates.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(StatusCodes.CREATED).json({ collage });
};



const deleteSemesterTemplate = async (req, res) => {
  const id = req.params.id;

  const collages = await Major.semesterTemplates.findByIdAndDelete({ _id: id });

  res.status(StatusCodes.OK).json({});
};
const getMajorTemplates = async (req, res) => {
  const id = req.params.id;

  var semesterTemplates=await Major.findOne({_id: id}).populate('semesterTemplates')
  // console.log(semesterTemplates)

   semesterTemplates=semesterTemplates.semesterTemplates
  res.status(StatusCodes.OK).json({ semesterTemplates});
};const getAllemesterTemplates = async (req, res) => {

  var semesterTemplates=await SemesterTemp.find({})
  // console.log(semesterTemplates)

  //  semesterTemplates=semesterTemplates.semesterTemplates
  res.status(StatusCodes.OK).json({ semesterTemplates});
};

const addCourseToSemesterTemplate = async (req, res) => {
  const { semesterId, courseId } = req.body;
  const semesterTemplate = await SemesterTemp.findOne({ _id: semesterId })
  semesterTemplate.subjects.push(courseId);
  await semesterTemplate.save();

  res.status(StatusCodes.OK).json(semesterTemplate);
};

module.exports = {
  getSemesterTemplate,
createSemesterTemplate,
updateSemesterTemplate,
getMajorTemplates,
deleteSemesterTemplate,
addCourseToSemesterTemplate,
getAllemesterTemplates,
getMajorTemplates
};
