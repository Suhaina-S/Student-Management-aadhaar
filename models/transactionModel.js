const mongoose = require("mongoose");

const txSchema = new mongoose.Schema(
    {

        transactionDetails: {
            
            regNumber: String,
            uniqueID: String, 
            typee: String,
            txId: String,
            amt: String,
            pur:[String],
            pay_status: String,
        },


    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", txSchema);
