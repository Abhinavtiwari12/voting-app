import { Admin } from "../models/admin.model.js";



export const findCandidate = async (condition) => {
  const admin = await Admin.findOne(condition);

  if (!admin) {
    return {
      success: false,
      message: "No admin exist with this detail",
      data: null,
    };
  }

  return {
    success: true,
    message: "admin already exists",
    data: admin,
  };
};

export const registerCandidate = async (createUser) => {
  const admin = await Admin.create(createUser);

  if (!admin) {
    return {
      success: false,
      message: "admin not created",
      data: null,
    };
  }

  return {
    success: true,
    message: "admin created successfully",
    data: admin,
  };
};

