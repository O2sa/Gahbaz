const express = require("express");
const router = express.Router();

const {
getStudent,
createStudent,
deleteStudent,
updateStudent,
getAllStudents

} = require("../controllers/studentControllers");




//collages
router.route("/students").post(createStudent).get(getAllStudents)
// router.route("/students/getCollageStudents/:id").get(getCollageStudents)
router.route("/students/:id").patch(updateStudent).delete(deleteStudent).get(getStudent);


module.exports = router;
