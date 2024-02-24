const express = require("express");
const router = express.Router();

const {
    getMajor,
    getCollageMajors,
    createMajor,
    updateMajor,
    deleteMajor,
} = require("../controllers/majorControllers");




//collages
router.route("/majors").post(createMajor)
router.route("/majors/getCollageMajors/:id").get(getCollageMajors)
router.route("/majors/:id").patch(updateMajor).delete(deleteMajor).get(getMajor);


module.exports = router;
