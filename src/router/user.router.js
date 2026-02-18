import { Router } from "express";
import { registerNewUser, userlogin, userProfile, changeUserPassword, userlogout  } from "../controller/user.controller.js";
import { verifyUserJwt } from "../midleware/autho.midleware.js";



const router = Router()


router.route('/registerUser').post(registerNewUser)
router.route('/userlogin').post(userlogin)
router.route('/userlogout').post(verifyUserJwt, userlogout)
router.route('/userlogin/changeUserPassword').post(verifyUserJwt, changeUserPassword)
router.route("/userProfile").post(verifyUserJwt, userProfile)


// export default router
export default router