import { Candidate } from "../models/candidate.model.js";



export const findCandidate = async (condition) => {
  const candidate = await Candidate.findOne(condition);

  if (!candidate) {
    return {
      success: false,
      message: "No candidate exist with this detail",
      data: null,
    };
  }

  return {
    success: true,
    message: "candidate already exists",
    data: candidate,
  };
};

export const registerCandidate = async (createUser) => {
  const candidate = await Candidate.create(createUser);

  if (!candidate) {
    return {
      success: false,
      message: "candidate not created",
      data: null,
    };
  }

  return {
    success: true,
    message: "candidate created successfully",
    data: candidate,
  };
};

