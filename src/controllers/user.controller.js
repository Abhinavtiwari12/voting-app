import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { findUser, registerUser } from "../service/user.service.js"
import { Candidate } from "../models/candidate.model.js"



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerNewUser = asyncHandler( async (req, res) => {

    const {fullname, email, password, age, addharNumber, address, phoneNumber, roal} = req.body

    if(
        [fullname, email, password, age, addharNumber, address, phoneNumber, roal].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are require.")
    }

    const checkExistingUserCond = {
        addharNumber
    }
    const existedUser = await findUser(checkExistingUserCond)

    if (existedUser.success) {
        throw new ApiError(409, existedUser.message)
    }

    const createUser = {
        fullname,
        email,
        password,
        addharNumber,
        phoneNumber,
        roal,
        address,
        age,
        
    }

    const registeredUser = await registerUser(createUser)

    return res.status(201).json(
        new ApiResponse(201, registeredUser.data, registeredUser.message)
    )

})


const userlogin = asyncHandler(async (req, res) => {

    const {addharNumber, password} = req.body

    if (!addharNumber) {
        throw new ApiError(401, "addharNumber is require.")
    }

     const user = await User.findOne({ addharNumber })

    if (!user) {
        throw new ApiError(400, "addharNumber or password is wrong.")
    }

    const checkPassword = await user.isPasswordCorrect(password)

    if (!checkPassword) {
        throw new ApiError(400, "addharNumber or password is wrong.")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")

    const options = {
        httpOnly: true,
        secure: false
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken}, "user loggedIn successfull."))
})


const userProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

const changeUserPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required")
    }

    const user = await User.findById(req.user._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Old password is incorrect")
    }
 
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    )
})


const userlogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{}, "User logout success."))

})

const getAllCandidates = asyncHandler(async (req, res) => {

    const candidates = await Candidate.find({})
        .select("fullname party age candidateId")

    if (!candidates || candidates.length === 0) {
        throw new ApiError(404, "No candidates found")
    }

    return res.status(200).json(
        new ApiResponse(200, candidates, "Candidates fetched successfully")
    )
})

const getSingleCandidate = asyncHandler(async (req, res) => {

    const { candidateId } = req.body

    if (!candidateId) {
        throw new ApiError(400, "Candidate id is required")
    }
    
    const candidate = await Candidate.findOne({ candidateId })
        .select("fullName party age voteCount")

    if (!candidate) {
        throw new ApiError(404, "Candidate not found")
    }

    return res.status(200).json(
        new ApiResponse(200, candidate, "Candidate details fetched")
    )
})

const voteCandidate = asyncHandler(async (req, res) => {

    const { candidateId } = req.body

    if (!candidateId) {
        throw new ApiError(400, "Candidate id is required")
    }

    const user = await User.findById(req.user._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (user.roal !== "voter") {
        throw new ApiError(403, "Only voters can vote")
    }

    if (user.isVoted) {
        throw new ApiError(400, "You have already voted")
    }

    const candidate = await Candidate.findOne({ candidateId })

    if (!candidate) {
        throw new ApiError(404, "Candidate not found")
    }

    await Candidate.findOneAndUpdate(
        { candidateId },
        {
            $inc: { voteCount: 1 },
            $push: {
                votes: {
                    user: user._id,
                    votedAt: new Date()
                }
            }
        }
    )

    user.isVoted = true
    user.votedCandidate = candidate._id
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(200, {}, "Vote casted successfully")
    )
})

export { registerNewUser, 
    userlogin, 
    userProfile, 
    changeUserPassword, 
    userlogout, 
    voteCandidate, 
    getAllCandidates,
    getSingleCandidate
}