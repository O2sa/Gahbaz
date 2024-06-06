import { StatusCodes } from "http-status-codes";
import Student from "../models/Student.js";
import crypto from "crypto";

import { hashPassword } from "../utils/passwordUtils.js";
import University from "../models/University.js";
import sendMail from "../utils/mailer.js";
import Semester from "../models/Semester.js";
import Grade from "../models/Grade.js";
const createStudent = async (req, res) => {
  // console.log(req.body);

  // const user = await Student.create(req.body);

  // const hashedPassword = await hashPassword(req.body.email);
  // const updatedUser = await Student.findByIdAndUpdate(user._id, {
  //   password: hashedPassword,
  // }).select("-password");

  try {
    const { email, firstName, lastName } = req.body;
    req.body["university"] = req.user.university;

    // Generate a temporary password
    // const tempPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await hashPassword(email);

    // Create the user with the temporary password
    const newUser = new Student({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    // Send email with the temporary password
    const subject = "Welcome to E-Learning Platform - Your Temporary Password";
    const text = `Hello ${firstName},\n\nYour account has been created. Please use the following temporary password to log in for the first time:\n\nTemporary Password: ${email}\n\nPlease change your password after logging in.\n\nThank you,\nE-Learning Platform Team`;

    await sendMail(email, subject, text);

    res.status(StatusCodes.CREATED).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateStudent = async (req, res) => {
  const id = req.params.id;
  const student = await Student.findByIdAndUpdate(id, req.body);
  res.status(StatusCodes.CREATED).json({ student });
};

const getStudent = async (req, res) => {
  const id = req.params.id;
  const student = await Student.findById(id)
    .populate("major")
    .select("-password");
  res.status(StatusCodes.CREATED).json(student);
};

const deleteStudent = async (req, res) => {
  const id = req.params.id;
  const student = await Student.findByIdAndDelete(id).select("-password");
  await Semester.updateMany(
    { students: student._id },
    { $pull: { students: student._id } }
  );
  await Grade.deleteMany({ student: student._id });

  // const major = await Major.findById(student.major);
  // major.students.pull(student._id)
  // await major.save()
  res.status(StatusCodes.CREATED).json(student);
};

const getSemstersGrades = async (req, res) => {
  const id = req.params.id;

  const semesters = await Student.findById(id);
  res.status(StatusCodes.CREATED).json(semesters);
};

const getCurrentCourses = async (req, res) => {
  res.status(StatusCodes.CREATED).json();
};

const getAllStudents = async (req, res) => {
  const students = await Student.find({
    university: req.user.university,
  })
    .select("-password")
    .populate("major");
  res.status(StatusCodes.CREATED).json(students);
};

export {
  createStudent,
  getCurrentCourses,
  getSemstersGrades,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getStudent,
};
