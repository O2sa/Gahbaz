import { addMessage, getMessages }from "../controllers/messagesController.js"
// const { protect } = require("../middleware/authMiddleware");


import { Router } from "express";
const router = Router();



import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, path.join(__dirname, "../images/attachments"))
    },
    filename: function (req, file, cb) { 
        cb(null, Date.now() + "_" + file.originalname)
    }
});
const upload = multer({ storage: storage });
router.route("/addmsg/",).put( upload.single("attachment"), addMessage);
router.route("/getmsg/:chatId",).get( getMessages);



export default router;
