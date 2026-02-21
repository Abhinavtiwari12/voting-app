import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { Candidate } from "../models/candidate.model.js"
import { Admin } from "../models/admin.model.js"
import jwt from "jsonwebtoken"



export const verifyUserJwt = asyncHandler(async (req, res, next)  =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    
        if (!token) {
            throw new ApiError(401, "unathorized token")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")   
    
        if (!user) {
            throw new ApiError(409, "invalid access token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")
    }
})



export const verifyAdminJwt = asyncHandler(async (req, res, next)  =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    
        if (!token) {
            throw new ApiError(401, "unathorized token")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")   
    
        if (!admin) {
            throw new ApiError(409, "invalid access token")
        }
    
        req.admin = admin;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")
    }
})