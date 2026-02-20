import { Router } from "express";
import { registerNewCandidate, updateCandidate, deleteCandidate  } from "../controllers/candidate.controller.js";
import { verifyAdminJwt } from "../midleware/autho.midleware.js";
import { adminlogin, adminlogout, adminProfile, registerNewAdmin } from "../controllers/admin.conrtoller.js";



const router = Router()

router.route('/registerNewAdmin').post(registerNewAdmin)
router.route('/adminlogin').post(adminlogin)
router.route('/adminProfile').post(verifyAdminJwt, adminProfile)
router.route('/adminlogout').post(verifyAdminJwt, adminlogout)
router.route('/registerNewCandidate').post(verifyAdminJwt , registerNewCandidate)
router.route('/updatecandidate').put(verifyAdminJwt, updateCandidate)
router.route('/deletecandidate').delete(verifyAdminJwt, deleteCandidate)


// export default router
export default router