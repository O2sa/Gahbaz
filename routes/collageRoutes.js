import { Router } from "express";
const router = Router();
import {
getCollage,
createCollage,
updateCollage,
getAllCollages,
deleteCollage
} from "../controllers/collageControllers.js"




//collages
router.route("/").get(getAllCollages).post(createCollage);
router.route("/:id").patch(updateCollage).delete(deleteCollage).get(getCollage);


export default router;
