const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middleware/auth");
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/profile");

// ❌ Removed redundant fileUpload middleware
// router.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" })); 

// ********************************************************************************************************
//                                      Profile Routes
// ********************************************************************************************************

//  Delete User Account
router.delete("/deleteProfile", auth, deleteAccount);

// Update User Profile Details
router.put("/updateProfile", auth, updateProfile);

//  Get User Details
router.get("/getUserDetails", auth, getAllUserDetails);

//  Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

//  Update Profile Picture (Requires File Upload)
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

// Instructor Dashboard (Only Accessible to Instructors)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
