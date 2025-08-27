const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const User = require("../models/User");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const cloudinary = require("cloudinary").v2;

// ✅ Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, about, contactNumber, gender } = req.body;
    const id = req.user.id;

    const user = await User.findById(id).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Update User and Profile Details
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    await user.save();

    const profile = user.additionalDetails;
    if (profile) {
      profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
      profile.about = about || profile.about;
      profile.contactNumber = contactNumber || profile.contactNumber;
      profile.gender = gender || profile.gender;
      await profile.save();
    }

    // ✅ Return Updated User Data
    const updatedUserDetails = await User.findById(id).populate("additionalDetails");

    res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Delete Profile (if it exists)
    if (user.additionalDetails) {
      await Profile.findByIdAndDelete(user.additionalDetails);
    }

    // ✅ Remove user from enrolled courses
    await Course.updateMany(
      { _id: { $in: user.courses } },
      { $pull: { studentsEnrolled: id } }
    );

    // ✅ Delete Course Progress
    await CourseProgress.deleteMany({ userId: id });

    // ✅ Delete User Account
    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ success: false, message: "User deletion failed" });
  }
};

// ✅ Get All User Details
exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id).populate("additionalDetails");

    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Get User Details Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Update Display Picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    // ✅ Check if a file is uploaded
    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.files.displayPicture;

    // ✅ Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "displaypictures",
    });

    // ✅ Update user's profile picture
    const profile = await Profile.findByIdAndUpdate(
      req.user.id,
      { displayPicture: result.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Display picture updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Update Display Picture Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ✅ Get Enrolled Courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: { path: "subSection" },
        },
      })
      .lean();

    if (!userDetails || !userDetails.courses.length) {
      return res.status(404).json({ success: false, message: "No enrolled courses found" });
    }

    // ✅ Calculate Progress for Each Course
    for (let course of userDetails.courses) {
      let totalDurationInSeconds = 0;
      let totalVideos = 0;

      course.courseContent.forEach((section) => {
        section.subSection.forEach((sub) => {
          totalDurationInSeconds += parseInt(sub.timeDuration || 0);
        });
        totalVideos += section.subSection.length;
      });

      course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

      const courseProgress = await CourseProgress.findOne({
        courseID: course._id,
        userId: userId,
      });

      const completedVideos = courseProgress?.completedVideos?.length || 0;
      course.progressPercentage = totalVideos === 0 ? 100 : Math.round((completedVideos / totalVideos) * 100);
    }

    res.status(200).json({ success: true, data: userDetails.courses });
  } catch (error) {
    console.error("Get Enrolled Courses Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Instructor Dashboard
exports.instructorDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .select("courseName courseDescription studentsEnrolled price");

    const courseData = courses.map((course) => ({
      _id: course._id,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      totalStudentsEnrolled: course.studentsEnrolled.length,
      totalAmountGenerated: course.studentsEnrolled.length * course.price,
    }));

    res.status(200).json({ success: true, courses: courseData });
  } catch (error) {
    console.error("Instructor Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
