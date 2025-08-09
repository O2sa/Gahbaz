import {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup,
    groupPicUpdate,
    deleteChat,
} from "../controllers/chatController.js"
// const { protect } = require("../middleware/authMiddleware");


import { Router } from "express";
const router = Router();



import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, path.join(__dirname, "../images/profile_pictures")) 
    },
    filename: function (req, file, cb) { 
        cb(null, Date.now() + "_" + file.originalname) 
    }
})
const upload = multer({ storage: storage });
router.route("/group").post( createGroupChat);
router.route("/rename").put( renameGroup);
router.route("/groupremove").put( removeFromGroup);
router.route("/groupadd").put( addToGroup);
router.route("/grouppic").put( upload.single("groupPic"), groupPicUpdate);
router.route("/accessChat").post( accessChat);
router.route("/fetchChats").get( fetchChats);
router.route("/deleteChat").put( deleteChat);


export default router;
