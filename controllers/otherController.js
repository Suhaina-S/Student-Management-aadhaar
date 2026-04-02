const jwtDecode = require('jwt-decode');
const jwtEncode = require('jwt-encode');
const Student = require("../models/studentModel");
const axios = require('axios');
const { EMAIL_IP } = require("../config/ip.config"); // import the IP

const SECRET_KEY = "HLMVSD1767HJJJBi864VCEHHGC65676P67HUUIYDTSDUVKVU907784567NXU789IP";

exports.checkID = async (req, res) => {
  var { uniqueID } = req.body;

  // console.log("Encrypted:", uniqueID);

  uniqueID = jwtDecode.jwtDecode(uniqueID);
  console.log("Decrypted:", uniqueID);

  if (!uniqueID) {
    return res.status(400).json({ success: false, error: "uniqueID is required." });
  }

  try {
    const student = await Student.findOne({ uniqueID });

    if (student) {
      const phoneNumber = student.contactDetails.mobile;
      const mailID = student.contactDetails.email;
      const encryptedPhoneNumber = jwtEncode(phoneNumber, SECRET_KEY, 'ES256 ');
      const generatedMailOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const url = `http://${EMAIL_IP}:5000/service/send_email`;
        const payload = {
        "from": "admin@aadhaar.com",
        "to": mailID,
        "subject": "Aadhaar verification OTP",
        "body": `Your OTP for aadhaar verfication is ${generatedMailOTP}`,
        "attachment": null
      };

      const headers = {
        "X-API-KEY":
          "0898c79d9edee1eaf79e1f97718ea84da47472f70884944ba1641b58ed24796c",
        "X-CLIENT-SECRET": "default_password",
        "Content-Type": "application/json"
      }
      const encryptedMailOTP = jwtEncode(generatedMailOTP, SECRET_KEY, 'ES256 ');
      console.log(phoneNumber);
      console.log(encryptedPhoneNumber);
      console.log(jwtDecode.jwtDecode(encryptedPhoneNumber));
      console.log(mailID);
      console.log(generatedMailOTP);
      console.log(encryptedMailOTP);
      console.log(jwtDecode.jwtDecode(encryptedMailOTP));

      try {
        axios.post(url, payload, { headers })
          .then(response => {
            {
              console.log('Response:', response.data);
              return res.status(200).json({ success: true, phone: encryptedPhoneNumber, mailOTP: encryptedMailOTP });

            }
          })
          .catch(error => {
            {
              console.error('Error calling API:', error.response ? error.response.data : error.message);
              return res.status(500).json({ success: false, error: "Server error" });


            }
          });

      } catch (error) {
        console.error('Error calling API:', error.response ? error.response.data : error.message);

        return res.status(500).json({ success: false, error: "Server error" });
      }



    } else {
      return res.status(200).json({ success: false });
    }

  } catch (err) {
    console.error("Error checking unique ID:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


exports.checkAddr = async (req, res) => {
  console.log("hi");
  var { uniqueID } = req.body;

  uniqueID = jwtDecode.jwtDecode(uniqueID);
  console.log("Decrypted:", uniqueID);

  if (!uniqueID) {
    return res.status(400).json({ success: false, error: "uniqueID is required." });
  }

  try {
    const student = await Student.findOne({ uniqueID });

    if (student) {
      const dob = jwtEncode(student.nameDetails.dob, SECRET_KEY, 'ES256 ');
      const addr = jwtEncode(student.addressDetails.currentAddress, SECRET_KEY, 'ES256 ');
      return res.status(200).json({ dob: dob, address : addr });
    } else{
      return res.status(200).json({ message  : "invalid aadhaar number" });
    }
  } catch (error) {
    console.error('Error calling API:', error.response ? error.response.data : error.message);

    return res.status(500).json({ success: false, error: "Server error" });
  }
};