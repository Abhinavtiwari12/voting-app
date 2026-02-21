import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Candidate } from "../models/candidate.model.js"
import { findCandidate, registerCandidate } from "../service/candidate.service.js"


const registerNewCandidate = asyncHandler( async (req, res) => {

    const {fullname, age, party, addharNumber, candidateId} = req.body

    if(
        [fullname, age, party, addharNumber, candidateId].some((field) => field?.trim() === "")
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
        party,
        candidateId

    }

    const registeredCandidate = await registerCandidate(createUser)

    return res.status(201).json(
        new ApiResponse(201, registeredCandidate.data, registeredCandidate.message)
    )

})


const updateCandidate = asyncHandler( async (req, res) => {
    

    const {fullname, age, addharNumber, party, candidateId} = req.body

    const candidate = await Candidate.findOneAndUpdate(
 
        { candidateId: candidateId},
        {
            $set: {
                fullname,
                age,
                addharNumber,
                party
            }
        },
        {new: true}
    )

    if (!candidate) {
        throw new ApiError(400, "somthing went wrong please check candidate id.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, candidate, "Account updated successfully"))
})


const deleteCandidate = asyncHandler(async (req, res) => {
    const {candidateId} = req.body

    const candidate = await Candidate.findOneAndDelete(
        {candidateId: candidateId}
    )

    if (!candidate) {
        throw new ApiError(404, "candidate does not dound")
    }

    return res.status(200).json(
        new ApiResponse(200, candidate, "candidate delete sucessfull.")
    )
})


export { registerNewCandidate, updateCandidate, deleteCandidate }