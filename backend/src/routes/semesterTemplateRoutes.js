const express = require("express");
const router = express.Router();

const {
    getSemesterTemplate,
    createSemesterTemplate,
    updateSemesterTemplate,
    deleteSemesterTemplate,
    addCourseToSemesterTemplate,
    getMajorTemplates,
    getAllemesterTemplates,
} = require("../controllers/semesterTempControllers");




//collages
router.route("/semesterTemplates").post(createSemesterTemplate).get(getAllemesterTemplates)
router.route("/semesterTemplates/addCourseToSemesterTemplate").post(addCourseToSemesterTemplate);
router.route("/semesterTemplates/:id").patch(updateSemesterTemplate).delete(deleteSemesterTemplate).get(getSemesterTemplate)
router.route("/semesterTemplates/getMajorTemplates/:id").get(getMajorTemplates);


module.exports = router;
