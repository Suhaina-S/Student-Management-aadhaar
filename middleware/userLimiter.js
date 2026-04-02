// // middleware/userLimiter.js

// const fs = require("fs");
// const path = require("path");

// const MAX_USERS = 5;
// let activeUsers = 0;
// let waitingQueue = [];

// // log file path
// const logFile = path.join(__dirname, "../logs/userLimiter.log");

// // helper: write logs to file + console
// const logMessage = (msg) => {
// //  const log = `[${new Date().toISOString()}] ${msg}\n`;
//   fs.appendFileSync(logFile, log);
//   //console.log(log.trim());
// };

// const userLimiter = (req, res, next) => {
//   const startRequest = () => {
//     activeUsers++;
//     logMessage(` Active Users: ${activeUsers},  Waiting: ${waitingQueue.length}`);

//     res.on("finish", () => {
//       activeUsers--;
//       logMessage(`Finished. Active: ${activeUsers}, Waiting: ${waitingQueue.length}`);

//       if (waitingQueue.length > 0) {
//         const nextReq = waitingQueue.shift();
//         nextReq();
//       }
//     });

//     next();
//   };

//   if (activeUsers < MAX_USERS) {
//     startRequest();
//   } else {
//     logMessage(`Request queued. Active: ${activeUsers}, Waiting: ${waitingQueue.length + 1}`);
//     waitingQueue.push(startRequest);
//   }
// };

// module.exports = userLimiter;




// middleware/userLimiter.js
// const fs = require("fs");
// const path = require("path");

// const MAX_USERS = 5;
// let activeUsers = 0;
// let waitingQueue = [];

// const logFile = path.join(__dirname, "../logs/userLimiter.log");

// const logMessage = (msg) => {
//   const log = `[${new Date().toISOString()}] ${msg}\n`;
//   fs.appendFileSync(logFile, log);
//   console.log(log.trim());
// };

// const userLimiter = (req, res, next) => {
//   const startRequest = () => {
//     activeUsers++;
//     logMessage(`Active: ${activeUsers}, Waiting: ${waitingQueue.length}`);

//     res.on("finish", () => {
//       activeUsers--;
//       logMessage(`Finished. Active: ${activeUsers}, Waiting: ${waitingQueue.length}`);
//       if (waitingQueue.length > 0) waitingQueue.shift()();
//     });

//     next();
//   };

//   if (activeUsers < MAX_USERS) startRequest();
//   else {
//     logMessage(`Request queued. Active: ${activeUsers}, Waiting: ${waitingQueue.length + 1}`);
//     waitingQueue.push(startRequest);
//   }
// };

// // ✅ helper to expose current stats
// const getStatus = () => ({
//   activeUsers,
//   waitingUsers: waitingQueue.length,
//   maxUsers: MAX_USERS,
// });

// module.exports = { userLimiter, getStatus };




// const fs = require("fs");
// const path = require("path");

// const MAX_USERS = 3;
// let activeUsers = 0;
// let waitingQueue = [];

// const logFile = path.join(__dirname, "../logs/userLimiter.log");

// // helper to write logs
// const logMessage = (msg) => {
//   const log = `[${new Date().toISOString()}] ${msg}\n`;
//   fs.appendFileSync(logFile, log);
//   console.log(log.trim());
// };

// const userLimiter = (req, res, next) => {
//   const startRequest = () => {
//     activeUsers++;
//     logMessage(`START - ${req.method} ${req.originalUrl} | Active: ${activeUsers}, Waiting: ${waitingQueue.length}`);

//     // cleanup function for finish or close
//     const cleanup = () => {
//       activeUsers = Math.max(0, activeUsers - 1);
//       logMessage(`FINISH - ${req.method} ${req.originalUrl} | Active: ${activeUsers}, Waiting: ${waitingQueue.length}`);
//       if (waitingQueue.length > 0) {
//         logMessage(`Dequeuing next request...`);
//         waitingQueue.shift()();
//       }
//     };

//     res.on("finish", cleanup);
//     res.on("close", cleanup); // handle aborted requests

//     next();
//   };

//   if (activeUsers < MAX_USERS) {
//     startRequest();
//   } else {
//     logMessage(`QUEUED - ${req.method} ${req.originalUrl} | Active: ${activeUsers}, Waiting: ${waitingQueue.length + 1}`);
//     waitingQueue.push(startRequest);
//   }
// };

// // helper to expose current stats
// const getStatus = () => ({
//   activeUsers,
//   waitingUsers: waitingQueue.length,
//   maxUsers: MAX_USERS,
// });

// const limitUserSessions = async (req, res, next) => {
//   const userId = req.body.username; // or req.session.user._id

//   if (!userId) return next();

//   const sessionStore = req.sessionStore;

//   // get all sessions from MongoStore
//   sessionStore.all(async (err, sessions) => {
//     if (err) return res.status(500).json({ message: "Session error" });

//     // filter sessions for this user
//     const userSessions = Object.values(sessions).filter(
//       s => s.user && s.user.username === userId
//     );

//     if (userSessions.length >= MAX_SESSIONS_PER_USER) {
//       return res.status(403).json({ 
//         message: `Max sessions exceeded (${MAX_SESSIONS_PER_USER})`
//       });
//     }

//     next();
//   });
// };




// module.exports = { userLimiter, getStatus };


const fs = require("fs");
const path = require("path");

const MAX_USERS = 3;  // per instance
let activeUsers = 0;
let waitingQueue = [];

const logFile = path.join(__dirname, "../logs/userLimiter.log");

const logMessage = (msg) => {
  const log = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(logFile, log);
  console.log(log.trim());
};

const userLimiter = (req, res, next) => {
  const startRequest = () => {
    activeUsers++;
    logMessage(`START - ${req.method} ${req.originalUrl} | Active: ${activeUsers}, Waiting: ${waitingQueue.length}`);

    const cleanup = () => {
      activeUsers = Math.max(0, activeUsers - 1);
      logMessage(`FINISH - ${req.method} ${req.originalUrl} | Active: ${activeUsers}, Waiting: ${waitingQueue.length}`);
      if (waitingQueue.length > 0) {
        waitingQueue.shift()();
      }
    };

    res.on("finish", cleanup);
    res.on("close", cleanup);

    next();
  };

  if (activeUsers < MAX_USERS) {
    startRequest();
  } else {
    logMessage(`QUEUED - ${req.method} ${req.originalUrl} | Active: ${activeUsers}, Waiting: ${waitingQueue.length + 1}`);
    waitingQueue.push(startRequest);
  }
};

const getStatus = () => ({
  activeUsers,
  waitingUsers: waitingQueue.length,
  maxUsers: MAX_USERS,
});

module.exports = { userLimiter, getStatus };
