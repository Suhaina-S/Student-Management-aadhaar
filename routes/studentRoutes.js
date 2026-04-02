const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");

const {
  createOrUpdateStudent,
  updateName,
  updateAddress,
  updateEducation,
  updateContact,
  updatePhoto,
  getAllStudents,
  getPhotoByRegNumber,
  getStudentDetails,
  getPhotoUniqueID,
  getIdDetails,
  getContactDetails,
  generateStudentUniqueId,
  checkReg,
  checkUniqueId,
} = studentController;

// ✅ Create or update student by regNumber
router.post("/", createOrUpdateStudent);
router.post("/check", checkReg);
router.post("/checkId", checkUniqueId);

// ✅ Update individual fields
router.post("/name", updateName);
router.post("/address", updateAddress);
router.post("/education", updateEducation);
router.post("/contact", updateContact);
router.post("/photo", updatePhoto);
router.post("/generate-id", generateStudentUniqueId);
// ✅ Fetch all students
router.get("/all", getAllStudents);

// ✅ Get photo by regNumber
router.get("/photo/:regNumber", getPhotoByRegNumber);

// ✅ Get full student details by regNumber
router.get("/details/:regNumber", getStudentDetails);

// ✅ Get photo by unique ID
router.get("/photo/id/:uniqueID", getPhotoUniqueID);

// ✅ Get student details by unique ID
router.get("/details/id/:uniqueID", getIdDetails);

// ✅ Update contact details
router.post("/contact-details", getContactDetails);
module.exports = router;
