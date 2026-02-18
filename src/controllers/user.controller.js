import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import { findUser, registerUser } from "../service/user.service.js"



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
        
    }

    const registeredUser = await registerUser(createUser)

    return res.status(201).json(
        new ApiResponse(201, registeredUser.data, registeredUser.message)
    )

})


const userlogin = asyncHandler(async (req, res) => {

    const {addharNumber, password} = req.body

    if (!addharNumber) {
        throw new ApiError(401, "Username or email is require.")
    }

    const query = addharNumber

    const user = await User.findOne(query)

    if (!user) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const checkPassword = await user.isPasswordCorrect(password)

    if (!checkPassword) {
        throw new ApiError(400, "username, email or password is wrong.")
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
    .json(new apiResponse(200,{}, "User logout success."))

})

export { registerNewUser, userlogin, userProfile, changeUserPassword, userlogout }