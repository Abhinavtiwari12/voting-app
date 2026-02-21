import { Router } from "express";
import { 
    registerNewUser, 
    userlogin, 
    userProfile, 
    changeUserPassword, 
    userlogout, 
    voteCandidate  
} from "../controllers/user.controller.js";
import { verifyUserJwt } from "../midleware/autho.midleware.js";



const router = Router()


router.route('/registerUser').post(registerNewUser)
router.route('/userlogin').post(userlogin)
router.route('/userlogout').post(verifyUserJwt, userlogout)
router.route('/changeUserPassword').post(verifyUserJwt, changeUserPassword)
router.route("/userProfile").post(verifyUserJwt, userProfile)
router.route('/voteCandidate').post(verifyUserJwt, voteCandidate)


// export default router
export default router