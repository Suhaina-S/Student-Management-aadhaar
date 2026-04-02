const Register = require("../models/registerModel");

exports.signup = async (req, res) => {
  const { fullName, username, password ,accName,accNo} = req.body;
  if (!fullName || !username || !password||!accName||!accNo)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const existingUser = await Register.findOne({ username });
    if (existingUser)
      return res.status(409).json({ error: "Username already exists." });

    const newUser = new Register({ fullName, username, password ,accName,accNo});
    await newUser.save();
    res.status(200).json({ message: "Signup successful." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Both fields are required." });

  try {
    const user = await Register.findOne({ username });
    if (!user || user.password !== password)
      return res.status(401).json({ error: "Invalid username or password." });
    if(user)
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};
 