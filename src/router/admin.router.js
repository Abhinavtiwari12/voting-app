import { Router } from "express";
import { registerNewCandidate, updateCandidate, deleteCandidate  } from "../controllers/candidate.controller.js";
import { adminlogin, adminlogout, adminProfile, getCandidateVoteDetails, getWinner, registerNewAdmin } from "../controllers/admin.conrtoller.js";
import { verifyAdminJwt } from "../midleware/autho.midleware.js";



const router = Router()

router.route('/registerNewAdmin').post(registerNewAdmin)
router.route('/adminlogin').post(adminlogin)
router.route('/adminProfile').get(verifyAdminJwt, adminProfile)
router.route('/adminlogout').post(verifyAdminJwt, adminlogout)
router.route('/registerNewCandidate').post(verifyAdminJwt , registerNewCandidate)
router.route('/updatecandidate').put(verifyAdminJwt, updateCandidate)
router.route('/deletecandidate').delete(verifyAdminJwt, deleteCandidate)
router.route('/getWinner').get(verifyAdminJwt, getWinner)
router.route('/getCandidateVoteDetails').get(verifyAdminJwt, getCandidateVoteDetails)



export default router