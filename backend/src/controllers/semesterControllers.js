const { StatusCodes } = require("http-status-codes");
const Semester = require("../models/Semester");
const Major = require("../models/Major");
const SemesterTemp = require("../models/SemesterTemp");
const Subject = require("../models/Subject");
const Course = require("../models/Course");
const Student = require("../models/Student");

const getSemester = async (req, res) => {
  const semId = req.params.semId;
  const semester = await Semester.findById(semId).populate("courses");

  // const cs = semester.populate("courses").exec();
  console.log(semester);
  res.status(StatusCodes.OK).json(semester);
};
const getAllSemesters = async (req, res) => {
  const semesters = await Semester.find();
  res.status(StatusCodes.OK).json(semesters);
};

const deleteSemester = async (req, res) => {
  const id = req.params.id;

  const semester = await Semester.findOneAndDelete({_id:id});


  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const updateSemester = async (req, res) => {
  const id = req.params.id;
const semester=await Semester.findByIdAndUpdate(id, req.body)
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};
const createSemester = async (req, res) => {
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const getSemesterCourses = async (req, res) => {
  const id = req.params.id;
const courses=await Semester.findByIdAndUpdate(id, req.body)
  res.status(StatusCodes.OK).json({ res: "Semsters Grades." });
};

const startSemester = async (req, res) => {
  const { semester, collage_id } = req.body;

  const majors = await Major.find({ collage: collage_id });

  const semsData = [];

  for (const mj of majors) {
    const tempSemesters = await SemesterTemp.find({ major: mj._id });
    const students = await Student.find({ major: mj._id });

    console.log("student" + students);
    console.log("major:" + mj._id);

    let filteredSemesters;
    if (semester === "first") {
      filteredSemesters = tempSemesters.filter((sem) => sem.index % 2 !== 0);
    } else {
      filteredSemesters = tempSemesters.filter((sem) => sem.index % 2 === 0);
    }
    console.log(filteredSemesters);

    for (const sem of filteredSemesters) {
      const newSemester = new Semester({
        major: sem.major,
        name: sem.name,
        startDate: Date.now(),
        endDate: Date.now(),
        status: "to-do",
      });

      filteredStudents = students.filter(
        (student) => student.comingSemester + 1 == sem.index
      );
      console.log("filteredStudents" + filteredStudents);

      for (const student of filteredStudents) {
        student.comingSemester += 1;
        student.semesters.push(newSemester._id);
        await student.save();
      }

      // await newSemester.save();
      console.log("courses:" + sem.subjects);
      console.log("courses length:" + sem.subjects.length);

      for (const course of sem.subjects) {
        console.log("course id:" + course);

        const tempCourse = await Subject.findById(course).select(
          "name collage -_id"
        );

        console.log("tempcourse:" + tempCourse);

        const newCourse = new Course({
          name: tempCourse.name,
          collage: tempCourse.collage.toString(),
          semester:newSemester.id
        });

        var gradesArr = [];

        students.forEach((student, index) => {
          gradesArr.push({ user: student._id, score: 0 });
        });
        console.log("gradesArr" + gradesArr);
        newCourse.studentsGrades = gradesArr
        await newCourse.save();
        console.log("newCourse" + newCourse);

        newSemester.courses.push(newCourse._id);
      }
      await newSemester.save();
    }
  }

  res.status(StatusCodes.OK).json(semsData);
};

module.exports = {
  getAllSemesters,
  startSemester,
  getSemester,
  createSemester,
  deleteSemester,
  getSemesterCourses,
  updateSemester,
deleteSemester
};
