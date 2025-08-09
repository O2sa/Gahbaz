import {
    //  login, 
    // register, 
    getAllUsers, 
    renameUser, 
    emailUpdate, 
    avatarUpdate, 
    passwordUpdate,
    deleteProfile,
 } from "../controllers/userController.js"


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

// router.post("/register", upload.single("avatar"), register);
// router.post("/login", login);

router.route("/allUsers").get( getAllUsers);
router.route("/deleteUser").put( deleteProfile);
router.route("/renameUser").put( renameUser);
router.route("/emailUpdate").put( emailUpdate);
router.route("/avatarUpdate").put( upload.single("avatar"), avatarUpdate);
router.route("/passwordUpdate").put( passwordUpdate);

export default router;
