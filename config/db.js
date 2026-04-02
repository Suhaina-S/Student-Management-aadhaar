// // config/db.js
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/student-card", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1); // Exit on failure
//   }
// };

// module.exports = connectDB;

// config/db.js
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const mongoURL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/student-card";

//     await mongoose.connect(mongoURL);

//     console.log("✅ MongoDB connected:", mongoURL);
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1); // Exit on failure
//   }
// };

// module.exports = connectDB;

// correct
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     // Use host.docker.internal when running inside Docker
//     const mongoURL =
//       process.env.MONGO_URL || "mongodb://host.docker.internal:27017/student-card";

//     await mongoose.connect(mongoURL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("✅ MongoDB connected:", mongoURL);
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1); // Exit on failure
//   }
// };

// module.exports = connectDB;
// const mongoose = require("mongoose");

// const connectDB = async () => {
//  try {
//     // Use host.docker.internal when running inside Docker
//     const mongoURL =
//       process.env.MONGO_URL || "mongodb://host.docker.internal:27017/student-card";

//     await mongoose.connect(mongoURL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("✅ MongoDB connected:", mongoURL);
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1); // Exit on failure
//   }
// };

// module.exports = connectDB;


// config/db.js
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     // await mongoose.connect("mongodb://mongo:27017/student-card"); // no need for useNewUrlParser / useUnifiedTopology
//     // await mongoose.connect("mongodb://localhost:27017/student-card") correct
//     // await mongoose.connect("mongodb://host.docker.internal:27017/student-card");
//     await mongoose.connect( "mongodb://localhost:27017/student-card",{ useNewUrlParser: true, useUnifiedTopology: true });
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://71762131052_db_user:suhaina123@cluster0.odwxrau.mongodb.net/student-card?retryWrites=true&w=majority",
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );
//     console.log("✅ MongoDB Atlas connected");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use MONGO_URI or fallback to local 'test' DB
    const mongoURI = process.env.MONGO_URI || "mongodb://mongo:27017/student-card";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected to: ${mongoose.connection.name}`);

    // Optional: create a default collection called 'users'
    const collectionExists = await mongoose.connection.db
      .listCollections({ name: "users" })
      .hasNext();

    if (!collectionExists) {
      await mongoose.connection.db.createCollection("users");
      console.log("✅ 'users' collection created in 'test' database");
    }

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;