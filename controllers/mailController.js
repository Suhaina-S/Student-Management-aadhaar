const CryptoJS = require('crypto-js');
const axios = require('axios');
//const Student = require("../models/studentModel");
const { EMAIL_IP } = require("../config/ip.config"); // import the IP
exports.sendMail = async (req, res) => {
  var { toId } = req.body;
  const url = `http://${EMAIL_IP}:5000/service/send_email`;
  const generatedMailOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const data = {
    "from": "admin@aadhaar.com",
    "to": toId,
    "subject": "Aadhaar verification OTP",
    "body": `Your OTP for aadhaar verification is ${generatedMailOTP}`,
    "attachment": null
  };

  const headers = {
    "X-API-KEY":
      "0898c79d9edee1eaf79e1f97718ea84da47472f70884944ba1641b58ed24796c",
    "X-CLIENT-SECRET": "default_password",
    "Content-Type": "application/json"
  }

  try {
    axios.post(url, data, { headers })
      .then(response => {
        {
          console.log('Response:', response.data);
          return res.status(200).json({ success: true, OTP: generatedMailOTP });
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
};






exports.sendImageMail = async (req, res) => {
  var { toId, image } = req.body;
  const url = `http://${EMAIL_IP}:5000/service/send_email`;   console.log("mail image checking",image);
  const data = {
    "from": "admin@aadhaar.com",
    "to": toId,
    "subject": "E-Aadhaar Id",
    "body": `Download your Aadhaar Card`,
    "attachment":{
      "filename":"aadhaar.jpg",
      "content":image
    }
    
  };

  const headers = {
    "X-API-KEY":
      "0898c79d9edee1eaf79e1f97718ea84da47472f70884944ba1641b58ed24796c",
    "X-CLIENT-SECRET": "default_password",
    "Content-Type": "application/json"
  }

  try {
    axios.post(url, data, { headers })
      .then(response => {
        {
          console.log("mail image checking erty");
          console.log('Response:', response.data);
          return res.status(200).json({ success: true });
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
};

exports.decryptURI = async (req, res) => {
  var { uri } = req.body;
  let details = {};

  try {
    const secretKey = "12345678901234567890123456789012!";
    const bytes = CryptoJS.AES.decrypt(
      decodeURIComponent(uri),
      secretKey
    );
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    details = JSON.parse(decrypted);
          return res.status(200).json({ data : details });

  } catch (err) {
    console.error("Failed to decrypt payment data", err);
return res.status(400).json({ message: `Failed to decrypt payment data ${err}` });

  }
}
  ;


