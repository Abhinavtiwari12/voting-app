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


export { registerNewUser, userlogin }