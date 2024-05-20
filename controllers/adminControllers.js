import { StatusCodes } from "http-status-codes";
import Admin from "../models/Admin.js";
import { generateTemporaryPassword, hashPassword } from "../utils/passwordUtils.js";


export const getAllAdmins = async (req, res) => {
  const admin = await Admin.find(req.params.id);
  res.status(StatusCodes.OK).json(admin);
};
export const createAdmin = async (req, res) => {
// Generate a temporary password
const saltRounds = 10; 

const temporaryPassword = generateTemporaryPassword();

// Hash the temporary password
const hashedPassword =await hashPassword(temporaryPassword)

  const admin = await Admin.create({...req.body, password: hashedPassword});
  res.status(StatusCodes.CREATED).json(admin);
};

export const getAdmin = async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  res.status(StatusCodes.OK).json(admin);
};

export const updateAdmin = async (req, res) => {
  const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json(updateAdmin);
};

export const deleteAdmin = async (req, res) => {
  const removedAdmin = await Admin.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json(removedAdmin);
};



