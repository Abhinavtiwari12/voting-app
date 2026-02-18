import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Candidate } from "../models/candidate.model.js"
import { findCandidate, registerCandidate } from "../service/admin.service.js"


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const candidate = await Candidate.findById(userId)
        const accessToken = candidate.generateAccessToken()
        const refreshToken = candidate.generateRefreshToken()

        candidate.refreshToken = refreshToken
        await candidate.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerNewCandidate = asyncHandler( async (req, res) => {

    const {fullname, age, party, addharNumber} = req.body

    if(
        [fullname, age, party, addharNumber].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are require.")
    }

    const checkExistingUserCond = {
        addharNumber
    }
    const existedUser = await findCandidate(checkExistingUserCond)

    if (existedUser.success) {
        throw new ApiError(409, existedUser.message)
    }

    const createUser = {
        fullname,
        age,
        addharNumber,
        party

    }

    const registeredUser = await registerCandidate(createUser)

    return res.status(201).json(
        new ApiResponse(201, registeredUser.data, registeredUser.message)
    )

})