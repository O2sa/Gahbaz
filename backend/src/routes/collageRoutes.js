const express = require("express");
const router = express.Router();

const {
getCollage,
createCollage,
updateCollage,
getAllCollages,
deleteCollage
} = require("../controllers/collageControllers");




//collages
router.route("/collages").get(getAllCollages).post(createCollage);
router.route("/collages/:id").patch(updateCollage).delete(deleteCollage).get(getCollage);


module.exports = router;
