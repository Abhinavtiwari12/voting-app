import { Router } from "express";
import { 
    registerNewUser, 
    userlogin, 
    userProfile, 
    changeUserPassword, 
    userlogout, 
    voteCandidate,  
    getSingleCandidate,
    getAllCandidates
} from "../controllers/user.controller.js";
import { verifyUserJwt } from "../midleware/autho.midleware.js";



const router = Router()


router.route('/registerUser').post(registerNewUser)
router.route('/userlogin').post(userlogin)
router.route('/userlogout').post(verifyUserJwt, userlogout)
router.route('/changeUserPassword').post(verifyUserJwt, changeUserPassword)
router.route("/userProfile").post(verifyUserJwt, userProfile)
router.route('/getAllCandidates').get(verifyUserJwt, getAllCandidates)
router.route('/getSingleCandidate').get(verifyUserJwt, getSingleCandidate)
router.route('/voteCandidate').post(verifyUserJwt, voteCandidate)


export default router