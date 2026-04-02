const Student = require("../models/studentModel");
const Counter = require("../models/counterModel");
const {
  collegeCodes,
  departmentCodes,
  courseCodes,
} = require("../config/educationData");

exports.checkReg = async (req, res) => {
  // ✅ Step 1: Ensure req.body exists
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Invalid or missing request body." });
  }

  const { regNumber } = req.body;

  // ✅ Step 2: Check if regNumber is provided
  if (!regNumber) {
    return res.status(400).json({ error: "Registration number is required." });
  }

  try {
    const existing = await Student.findOne({ regNumber });
    if (!existing) {
      return res.status(201).json({ message: "continue" });
    } else {
      return res
        .status(200)
        .json({ message: "Registration number already exists  ." });
    }
  } catch (err) {
    console.error("Error saving student:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
exports.checkUniqueId = async (req, res) => {
  // ✅ Step 1: Ensure req.body exists
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Invalid or missing request body." });
  }

  const { uniqueID } = req.body;

  // ✅ Step 2: Check if regNumber is provided
  if (!uniqueID) {
    return res.status(400).json({ error: "uniqueID number is required." });
  }

  try {
    const existing = await Student.findOne({ uniqueID });
    if (!existing) {
      return res.status(201).json({ message: "continue" });
    } else {
      const regNumber = existing.regNumber;
      return res
        .status(200)
        .json({ message: "unique ID already exists.", regNumber });
    }
  } catch (err) {
    console.error("Error saving student:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.createOrUpdateStudent = async (req, res) => {
  // ✅ Step 1: Ensure req.body exists
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ error: "Invalid or missing request body." });
  }

  const { regNumber } = req.body;

  // ✅ Step 2: Check if regNumber is provided
  if (!regNumber) {
    return res.status(400).json({ error: "Registration number is required." });
  }

  try {
    const existing = await Student.findOne({ regNumber });
    if (!existing) {
      await new Student({ regNumber }).save();
      return res.status(200).json({ message: "Registration number saved." });
    } else {
      return res
        .status(409)
        .json({ message: "Registration number already exists." });
    }
  } catch (err) {
    console.error("Error saving student:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.updateName = async (req, res) => {
  const { regNumber, nameDetails } = req.body;
  try {
    const student = await Student.findOneAndUpdate(
      { regNumber },
      { $set: { nameDetails } },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: "Student not found." });
    res.status(200).json({ message: "Name details updated."});
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateAddress = async (req, res) => {
  const { regNumber, addressDetails } = req.body;
  try {
    const student = await Student.findOneAndUpdate(
      { regNumber },
      { $set: { addressDetails } },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: "Student not found." });
    res.status(200).json({ message: "Address details updated." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updatePhoto = async (req, res) => {
  const { regNumber, photoDetails } = req.body;

  try {
    console.log("hello1234567")
    const student = await Student.findOneAndUpdate(
      { regNumber },
      { $set: { photoDetails } },
      { new: true }
    );
    console.log("1234567")
    if (!student) {
      console.log("2wsdx6tuy9iu")
      return res.status(404).json({ error: "Student not found." });
    }
    console.log("aesrdtfyuh")

    res.status(200).json({ message: "Photo details updated.", student });
  } catch (err) {
    console.log("zxcvbnm")
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateContact = async (req, res) => {
  const { regNumber, contactDetails } = req.body;

  // Validate input
  if (!regNumber || !contactDetails) {
    return res
      .status(400)
      .json({ error: "regNumber and contactDetails are required." });
  }

  try {
    const student = await Student.findOneAndUpdate(
      { regNumber },
      { $set: { contactDetails } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json({ message: "Contact details updated." });
  } catch (err) {
    console.error("Error updating contact details:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: "Error fetching students" });
  }
};
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: "Error fetching students" });
  }
};


exports.authenticateStudent = async (req, res) => {
  const { regNumber } = req.params;

  try {
    console.log("Received regNumber:", regNumber); 

    const student = await Student.findOne({ regNumber });

    if (!student || !student.photoDetails || !student.photoDetails.photo) {
      return res
        .status(404)
        .json({ error: "Photo not found for the student." });
    }

    res.status(200).json({ photo: student.photoDetails.photo });
  } catch (err) {
    console.error("Error fetching photo:", err);
    res.status(500).json({ error: "Server error while fetching photo." });
  }
};

exports.getPhotoByRegNumber = async (req, res) => {
  const { regNumber } = req.params;

  try {
    // console.log("hello");
    const student = await Student.findOne({ regNumber });

    if (!student || !student.photoDetails || !student.photoDetails.photo) {
      return res
        .status(404)
        .json({ error: "Photo not found for the given regNumber." });
    }

    // Send just the base64 string
    res.status(200).json({ photo: student.photoDetails.photo });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
// Get full student details by regNumber
exports.getStudentDetails = async (req, res) => {
  const { regNumber } = req.params;

  try {
    const student = await Student.findOne({ regNumber });

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json({ student });
  } catch (err) {
    console.error("Error fetching student details:", err);
    res.status(500).json({ error: "Server error while fetching details." });
  }
};

exports.getPhotoUniqueID = async (req, res) => {
  const { uniqueID } = req.params;
  try {
    console.log("hi");
    const student = await Student.findOne({ uniqueID });

    if (!student || !student.photoDetails || !student.photoDetails.photo) {
      return res.status(404).json({
        error: "Photo not found for the given uniqueID.",
      });
    }

    // Send just the base64-encoded photo
    res.status(200).json({ photo: student.photoDetails.photo });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
exports.getContactDetails = async (req, res) => {
  const { regNumber, contactDetails } = req.body;

  try {
    // ✅ Only update contactDetails, don't touch uniqueID
    const student = await Student.findOneAndUpdate(
      { regNumber },
      { $set: { contactDetails } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json({ message: "Contact details updated.", student });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.generateStudentUniqueId = async (req, res) => {
  const { college, startYear, endYear, department, course } = req.body;

  try {
    const collegeCode = collegeCodes[college];
    const deptCode = departmentCodes[department];
    const courseCode = courseCodes[department][course];

    if (!collegeCode || !deptCode || !courseCode) {
      return res.status(400).json({ error: "Invalid input combination" });
    }

    // Only take last 2 digits from year
    const shortStartYear = startYear.slice(-2);
    const shortEndYear = endYear.slice(-2);

    //  Construct key with shortened years
    const key = `${collegeCode}${shortStartYear}${shortEndYear}${deptCode}${courseCode}`;

    // 🔁 Maintain counter per key
    const counterDoc = await Counter.findOneAndUpdate(
      { key },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const uniqueId = key + counterDoc.value.toString().padStart(3, "0");

    res.status(200).json({ uniqueId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getIdDetails = async (req, res) => {
  const { uniqueID } = req.params;
  try {
    const student = await Student.findOne({ uniqueID });
    if (!student) return res.status(404).json({ error: "Student not found." });
    res.status(200).json({ student });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
};
exports.updateEducation = async (req, res) => {
  const { regNumber, educationDetails } = req.body;

  if (!regNumber || !educationDetails) {
    return res
      .status(400)
      .json({ error: "regNumber and educationDetails are required" });
  }

  const { collegeName, yearOfJoining, yearOfCompletion, degree, course } =
    educationDetails;

  try {
    const student = await Student.findOne({ regNumber });
// await new Promise(r => setTimeout(r, 5000));

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const collegeCode = collegeCodes[collegeName];
    const deptCode = departmentCodes[degree];
    const courseCode = courseCodes[degree]?.[course];

    if (!collegeCode || !deptCode || !courseCode) {
      return res.status(400).json({ error: "Invalid input combination" });
    }

    const shortStartYear = yearOfJoining.slice(-2);
    const shortEndYear = yearOfCompletion.slice(-2);
    const key = `${collegeCode}${shortStartYear}${shortEndYear}${deptCode}${courseCode}`;

    let finalUniqueID;

    // ✅ Check if student already has a matching key prefix in their uniqueID
    if (student.uniqueID != null) {
      finalUniqueID = student.uniqueID; // Reuse the same
    }


    else {
      // ✅ Always increment the counter for this key
      const counterDoc = await Counter.findOneAndUpdate(
        { key },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      if (!counterDoc || typeof counterDoc.value !== "number") {
        return res.status(500).json({ error: "Counter error or not found" });
      }

      // ✅ Generate new uniqueID using the updated counter value
      finalUniqueID = key + counterDoc.value.toString().padStart(3, "0");
    }

    // Update the student document
    student.educationDetails = educationDetails;
    student.uniqueID = finalUniqueID;
    await student.save();

    res.status(200).json({
      message: "Education details and unique ID updated successfully.",
      student,
      uniqueID: finalUniqueID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
