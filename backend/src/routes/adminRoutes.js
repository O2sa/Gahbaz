const express = require("express");
const router = express.Router();

// const {
//   addUser,
//   createAdmin,
//   getAllUsers,
//   deleteUser,
//   addCollage,
//   updateCollageInfo,
//   updateMajorInfo,
//   updateCourseInfo,
//   deleteCourse,
//   editSemester,
//   adminDashbord,
// } = require("../controllers/adminControllers");

// const {
//   addMajor,
//   getAllCollageMajors,
//   deleteMajor
// } = require("../controllers/majorControllers");
// const {
//   createSemesterTemp,
//   addCourseToSemesterTemp,

// } = require("../controllers/semesterTempControllers");
// const { startSemester,getSemester, getAllSemesters} = require("../controllers/semesterControllers");
// const {
//   createCourseTemp,
//   getAllCollageCoursesTemp,
//   deleteTempCourse
// } = require("../controllers/courseTempControllers");

// const {
//   setCourseTeacher,
// } = require("../controllers/courseControllers");

// //dashboard
// router.route("/").get(adminDashbord);
// router.route("/createAdmin").post(createAdmin);

// //users
// router.route("/users").get(getAllUsers).post(addUser);
// // router.route("/users/:userId").post(editUser).delete(deleteUser);

// //collages
// // router.route("/collage").get(getAllCollages).post(createCollage);
// // router.route("/collage/:collageId").patch(updateCollageInfo);

// router.route("/collage/major/:majorId").patch(updateMajorInfo).delete(deleteMajor);
// router.route("/collage/major").post(addMajor);
// router.route("/collage/major/:collageId").get(getAllCollageMajors);

// router.route("/collage/major/semesterTemp").post(createSemesterTemp);
// router
//   .route("/collage/major/semesterTemp/addCourseToSemesterTemp")
//   .post(addCourseToSemesterTemp);

// router.route("/collage/coursesTemp/:collage_id").get(getAllCollageCoursesTemp);
// router.route("/collage/coursesTemp").post(createCourseTemp).delete(deleteTempCourse);
// router.route("/collage/coursesTemp/:courseId").delete(deleteTempCourse);


// router.route("/collage/major/semester/startSemester").post(startSemester);
// router.route("/collage/major/semester").get(getAllSemesters);
// router.route("/collage/major/semester/:semId").get(getSemester);



// router.route("/collage/courses/:courseId").post(setCourseTeacher);

module.exports = router;
