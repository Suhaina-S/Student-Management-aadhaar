const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    regNumber: { type: String, required: true, unique: true, trim: true },
    uniqueID: { type: String },
   // current:{type:Boolean},
    nameDetails: {
      firstName: String,
      middleName: String,
      lastName: String,
      father: String,
      mother: String,
      gender: String,
      dob: String,
      placeOfBirth: String,
      nationality: String,
    },
    addressDetails: {
      permanentAddress: String,
      currentAddress: String,
      district: String,
      state: String,
      country: String,
    },
    educationDetails: {
      collegeName: String,
      degree: String,
      yearOfJoining: String,
      yearOfCompletion: String,
      course: String,
    },
    photoDetails: {
      photo: String,
    },
    contactDetails: {
      mobile: String,
      email: String,
    },
    transactionDetails:{
      typee:String,
      txId:String,
      amt:String,
      pay_status:String,
    },

    // fingerprintInfo: {
    //   matched: { type: Boolean, default: false },
    //   lastMatchedAt: { type: Date }, // optional, use when fingerprint is matched
    //   csvRowCount: { type: Number }, // number of SIFT descriptors
    //   imageFileName: { type: String }, // uploaded fingerprint image file name
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
