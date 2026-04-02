// const fs = require("fs");
// const path = require("path");

// // log file path
// const logFile = path.join(__dirname, "../logs/api.log");

// const logger = (req, res, next) => {
//   const start = Date.now();

//   res.on("finish", () => {
//     const duration = Date.now() - start;

//     // Get client IP (handles proxies as well)
//     const ip =
//       req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

//     const log = `[${new Date().toISOString()}] IP: ${ip} | ${req.method} ${
//       req.originalUrl
//     } | Status: ${res.statusCode} | Duration: ${duration}ms | Body: ${JSON.stringify(
//       req.body
//     )}\n`;

//     // Save log to file
//     fs.appendFileSync(logFile, log);

//     // Print to console too
//     console.log(log);
//   });

//   next();
// };

// module.exports = logger;
// logger.js
const fs = require("fs");
const path = require("path");

// log file paths
const logFile = path.join(__dirname, "../logs/api.log");
const jsonLogFile = path.join(__dirname, "../logs/api.json");
const ignorePaths = ["/status", "/api/logs"];


const logger = (req, res, next) => {
  if (ignorePaths.includes(req.path)) return next();

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    const logObject = {
      timestamp: new Date().toISOString(),
      ip,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      body: req.body,
    };

    // log to plain text
    const textLog = `[${logObject.timestamp}] IP: ${ip} | ${req.method} ${
      req.originalUrl
    } | Status: ${res.statusCode} | Duration: ${duration}ms | Body: ${JSON.stringify(
      req.body
    )}\n`;
    fs.appendFileSync(logFile, textLog);

    // log to JSON file
    try {
      let logs = {};
      if (fs.existsSync(jsonLogFile)) {
        const existing = fs.readFileSync(jsonLogFile, "utf8");
        logs = existing ? JSON.parse(existing) : {};
      }

      const dateKey = new Date().toISOString().split("T")[0]  ;
      if (!logs['logs']) logs['logs'] = [];
      logs['logs'].push(logObject);

      fs.writeFileSync(jsonLogFile, JSON.stringify(logs, null, 2));
    } catch (err) {
      console.error("Failed to write JSON log:", err);
    }

    console.log(textLog.trim());
  });

  next();
};

module.exports = logger;
