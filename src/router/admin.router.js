import { Router } from "express";
import { registerNewCandidate, updateCandidate, deleteCandidate  } from "../controllers/candidate.controller.js";
import { verifyAdminJwt } from "../midleware/autho.midleware.js";



const router = Router()


router.route('/registerNewCandidate').post(verifyAdminJwt , registerNewCandidate)
router.route('/updatecandidate').put(verifyAdminJwt, updateCandidate)
router.route('/deletecandidate').delete(verifyAdminJwt, deleteCandidate)


// export default router
export default router