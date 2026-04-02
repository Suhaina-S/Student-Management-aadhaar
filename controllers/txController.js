const Transaction = require("../models/transactionModel");

exports.getDash = async (req, res) => {
  try {
    console.log("dash");
    const students = await Transaction.find();
    res.status(200).json(students);
  } catch (err) {

    res.status(500).json({ error: "Error fetching students" });
  }
};
exports.updateTx = async (req, res) => {
    console.log("hiiiii");

  const {  transactionDetails } = req.body;
console.log(transactionDetails);
  // Validate input
  if ( !transactionDetails) {
    return res
      .status(400)
      .json({ error: "transactionDetails are required." });
  }

  try {
    console.log("sdfghjk");
    console.log("details tx",transactionDetails);
    const newTransaction = new Transaction({
      transactionDetails
    });

    await newTransaction.save();

    res.status(200).json({ message: "Transaction Details updated." });
  } catch (err) {
    console.error("Error updating  Tx details:", err);
    res.status(500).json({ error: "Server error" });
  }
};


