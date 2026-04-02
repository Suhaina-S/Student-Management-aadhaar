// // server.js

// const os = require("os");
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const Register = require("./models/registerModel");
// const logger = require("./middleware/logger");
// const { userLimiter, getStatus } = require("./middleware/userLimiter");
// const path = require('path');
// const fs = require('fs');
// const session = require("express-session");
// const MongoStore = require("connect-mongo");

// // Route Imports 
// const authRoutes = require("./routes/authRoutes");
// const studentRoutes = require("./routes/studentRoutes");
// const otherRoutes = require("./routes/otherRoutes"); 
// const mailRoutes = require("./routes/mailRoutes");
// const txRoutes = require("./routes/txRoutes");

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(logger);
// app.use(userLimiter); 

// // Connect to MongoDB
// connectDB().then(() => {
//   Register.init().then(() => {
//     console.log("✅ Username index created");
//   });
// });

// // Allowed MAC addresses (whitelist)
// const ALLOWED_MAC_ADDRESSES = [
//   "00:15:5d:3c:c8:46", 
//   "00:15:5d:7f:e2:fb",
//   "0a:00:27:00:00:06",
//   "0a:00:27:00:00:05",
// ];

// // Get MAC address from local machine
// const getLocalMachineMAC = () => {
//   const nets = os.networkInterfaces();
//   for (const name of Object.keys(nets)) {
//     for (const net of nets[name]) {
//       if (!net.internal && net.mac && net.mac !== "00:00:00:00:00:00") {
//         return net.mac.toLowerCase();
//       }
//     }
//   }
//   return null;
// };

// // Firewall middleware
// // const macAddressFirewall = (req, res, next) => {
// //   try {
// //     const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
// //     const cleanIP = clientIP.replace("::ffff:", "");

// //     let clientMAC = null;

// //     if (cleanIP === "127.0.0.1" || cleanIP === "::1") {
// //       // Localhost request — use actual machine MAC
// //       clientMAC = getLocalMachineMAC();
// //     }

// //     console.log(`Request from IP: ${cleanIP}, MAC: ${clientMAC || "Unknown"}`);

// //     if (clientMAC && ALLOWED_MAC_ADDRESSES.includes(clientMAC)) {
// //       console.log(`✅ Access granted for MAC: ${clientMAC}`);
// //       return next();
// //     }

// //     console.log(`❌ Access denied for IP: ${cleanIP}, MAC: ${clientMAC || "Unknown"}`);
// //     return res.status(403).json({ success: false, message: "Access denied: Device not authorized" });
// //   } catch (error) {
// //     console.error("MAC firewall error:", error);
// //     return res.status(500).json({ success: false, message: "Security check failed" });
// //   }
// // };


// // const macAddressFirewall = (req, res, next) => {
// //   try {
// //     const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
// //     const cleanIP = clientIP.replace("::ffff:", "");

// //     let clientMAC = null;

// //     if (cleanIP === "127.0.0.1" || cleanIP === "::1") {
// //       // Localhost request — use actual machine MAC
// //       clientMAC = getLocalMachineMAC();
// //     }

// //     console.log(`Request from IP: ${cleanIP}, MAC: ${clientMAC || "Unknown"}`);

// //     // ✅ Allow Docker bridge & local IPs
// //     const allowedIPs = ["127.0.0.1", "::1", "172.17.0.1"];
// //     if (allowedIPs.includes(cleanIP)) {
// //       console.log(`✅ Access granted for Docker/Local IP: ${cleanIP}`);
// //       return next();
// //     }

// //     // ✅ Allow whitelisted MACs
// //     if (clientMAC && ALLOWED_MAC_ADDRESSES.includes(clientMAC)) {
// //       console.log(`✅ Access granted for MAC: ${clientMAC}`);
// //       return next();
// //     }

// //     console.log(`❌ Access denied for IP: ${cleanIP}, MAC: ${clientMAC || "Unknown"}`);
// //     return res.status(403).json({
// //       success: false,
// //       message: "Access denied: Device not authorized",
// //     });
// //   } catch (error) {
// //     console.error("MAC firewall error:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Security check failed",
// //     });
// //   }
// // };

// const macAddressFirewall = (req, res, next) => {
//   try {
//     const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
//     const cleanIP = clientIP.replace("::ffff:", "");

//     let clientMAC = null;
//     if (cleanIP === "127.0.0.1" || cleanIP === "::1") {
//       clientMAC = getLocalMachineMAC();
//     }

//     console.log(`Request from IP: ${cleanIP}, MAC: ${clientMAC || "Unknown"}`);

//     // ✅ Allow localhost
//     if (cleanIP === "127.0.0.1" || cleanIP === "::1") {
//       console.log(`✅ Access granted for localhost: ${cleanIP}`);
//       return next();
//     }

//     // ✅ Allow any Docker internal network (172.*.*.*)
//     if (cleanIP.startsWith("172.")) {
//       console.log(`✅ Access granted for Docker internal IP: ${cleanIP}`);
//       return next();
//     }

//     // ✅ Allow whitelisted MACs
//     if (clientMAC && ALLOWED_MAC_ADDRESSES.includes(clientMAC)) {
//       console.log(`✅ Access granted for MAC: ${clientMAC}`);
//       return next();
//     }

//     // ❌ Deny all others
//     console.log(`❌ Access denied for IP: ${cleanIP}, MAC: ${clientMAC || "Unknown"}`);
//     return res.status(403).json({
//       success: false,
//       message: "Access denied: Device not authorized",
//     });
//   } catch (error) {
//     console.error("MAC firewall error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Security check failed",
//     });
//   }
// };




// // ➜ New endpoint to send log details to the frontend
// app.get("/api/logs", (req, res) => {
//   const logPath = path.join(__dirname, "logs", "api.json");

//   fs.readFile(logPath, "utf8", (err, data) => {
//     if (err) {
//       if (err.code === "ENOENT") return res.json({ logs: [] });
//       return res.status(500).json({ error: "Could not read log file" });
//     }
//     res.json({ logs: data.trim().split("\n") });
//   });
// });



// //limitingg the student unique card
// // ✅ Apply limiter only to student API
// app.post("/api/student/eduction", userLimiter, (req, res) => {
//   const { regNumber, educationDetails } = req.body;

//   // simulate processing
//      res.status(200).json({
//       message: "Student registered successfully",
//       data: { regNumber, educationDetails },
//     }); 
// });

// // app.post("/api/login", userLimiter, (req, res) => {
// //   const { username, password } = req.body;

// //   // simulate processing
// //      res.status(200).json({
// //       message: "Admin login successfully",
// //       data: { username, password },
// //     }); 
// // });

// // ✅ Optional: check current limiter stats
// app.get("/status", (req, res) => {
//   res.json(getStatus());
// });

// // Uncomment below line to enable MAC firewall
// // app.use(macAddressFirewall);

// // Routes
// app.use(macAddressFirewall);
// app.use("/api", authRoutes);
// app.use("/api/student", studentRoutes);
// app.use("/check", otherRoutes); // ✅ uses checkId
// app.use("/api/mail", mailRoutes);
// app.use("/api/admin",txRoutes);
// //session

// app.use(session({
//   secret: "zesxdcfgvhbredtfgyhughbj",
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGO_URL || "mongodb://host.docker.internal:27017/student-card",
//     collectionName: "sessions"
//   }),
//   cookie: { secure: false, maxAge: 1000 * 60 * 60 }
// }));

// app.get("/api/session-info", (req, res) => {
//   if (req.session.user) {
//     res.json({ loggedIn: true, user: req.session.user });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });


// //ststus limits logs
// app.get("/status", (req, res) => {
//   res.json(getStatus());
// });



// // Start Server
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

// module.exports = macAddressFirewall;



// server.js

const os = require("os");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./config/db");
const Register = require("./models/registerModel");
const logger = require("./middleware/logger");
const { userLimiter, getStatus } = require("./middleware/userLimiter");

// Route Imports 
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const otherRoutes = require("./routes/otherRoutes");
const mailRoutes = require("./routes/mailRoutes");
const txRoutes = require("./routes/txRoutes");

const app = express();
const PORT = 5000;

// ---------------------------
// ✅ MIDDLEWARE ORDER MATTERS
// ---------------------------
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(logger);
app.use(userLimiter);

// ✅ Add session middleware BEFORE routes/firewall
app.use(
  session({
    secret: "zesxdcfgvhbredtfgyhughbj",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGO_URL ||
        "mongodb://localhost:27017/student-card",
      collectionName: "sessions",
    }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 },
  })
);

// ---------------------------
// ✅ CONNECT DATABASE
// ---------------------------
connectDB().then(() => {
  Register.init().then(() => {
    console.log("✅ Username index created");
  });
});

// ---------------------------
// ✅ MAC FIREWALL CONFIG
// ---------------------------
const ALLOWED_MAC_ADDRESSES = [
  "00:15:5d:3c:c8:46",
  "00:15:5d:7f:e2:fb",
  "0a:00:27:00:00:06",
  "0a:00:27:00:00:05",
];

// Safe MAC retriever
const getLocalMachineMAC = () => {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const netList = nets[name];
    if (!netList) continue;
    for (const net of netList) {
      if (!net.internal && net.mac && net.mac !== "00:00:00:00:00:00") {
        return net.mac.toLowerCase();
      }
    }
  }
  return null;
};

// ✅ Firewall middleware (stable & Docker/localhost safe)
const macAddressFirewall = (req, res, next) => {
  try {
    const clientIP =
      req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const cleanIP = clientIP.replace("::ffff:", "");

    let clientMAC = null;
    if (cleanIP === "127.0.0.1" || cleanIP === "::1") {
      clientMAC = getLocalMachineMAC();
    }

    console.log(`Request from IP: ${cleanIP}, MAC: ${clientMAC || "Unknown"}`);

    // ✅ Allow localhost
    if (cleanIP === "127.0.0.1" || cleanIP === "::1") {
      console.log(`✅ Access granted for localhost: ${cleanIP}`);
      return next();
    }

    // ✅ Allow Docker internal IPs (172.*)
    if (cleanIP.startsWith("172.")) {
      console.log(`✅ Access granted for Docker internal IP: ${cleanIP}`);
      return next();
    }

    // ✅ Allow whitelisted MACs
    if (clientMAC && ALLOWED_MAC_ADDRESSES.includes(clientMAC)) {
      console.log(`✅ Access granted for MAC: ${clientMAC}`);
      return next();
    }

    // ❌ Deny anything else
    console.log(`❌ Access denied for IP: ${cleanIP}, MAC: ${clientMAC || "Unknown"}`);
    return res.status(403).json({
      success: false,
      message: "Access denied: Device not authorized",
    });
  } catch (error) {
    console.error("MAC firewall error:", error);
    return res.status(500).json({
      success: false,
      message: "Security check failed",
    });
  }
};

// ---------------------------
// ✅ LOG VIEWER ENDPOINT
// ---------------------------
app.get("/api/logs", (req, res) => {
  const logPath = path.join(__dirname, "logs", "api.json");

  fs.readFile(logPath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") return res.json({ logs: [] });
      return res.status(500).json({ error: "Could not read log file" });
    }
    res.json({ logs: data.trim().split("\n") });
  });
});

// ---------------------------
// ✅ SAMPLE TEST ROUTES
// ---------------------------
app.post("/api/student/education", userLimiter, (req, res) => {
  const { regNumber, educationDetails } = req.body;
  res.status(200).json({
    message: "Student registered successfully",
    data: { regNumber, educationDetails },
  });
});

// ✅ Status route
app.get("/status", (req, res) => {
  res.json(getStatus());
});

// ---------------------------
// ✅ APPLY FIREWALL AND ROUTES
// ---------------------------
app.use(macAddressFirewall);
app.use("/api", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/check", otherRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/admin", txRoutes);

// ---------------------------
// ✅ SESSION CHECK ENDPOINT
// ---------------------------
app.get("/api/session-info", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// ---------------------------
// ✅ START SERVER SAFELY
// ---------------------------
try {
  // app.listen(PORT, "127.0.0.1", () => {
  //   console.log(`✅ Server running at http://localhost:${PORT}`);
  // }); correct code

  app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

} catch (error) {
  console.error("❌ Server startup error:", error);
}

module.exports = macAddressFirewall;
