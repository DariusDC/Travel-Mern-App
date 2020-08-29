const { Router } = require("express");
const logEntry = require("../models/LogEntry");

const router = Router();

const { PASSWORD } = process.env;

router.get("/", async (req, res, next) => {
  try {
    const entries = await logEntry.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (req.get("x-password") !== PASSWORD) {
      res.status(401);
      throw new Error("UnAuthorized");
    }
    const newLogEntry = new logEntry(req.body);
    const createdLog = await newLogEntry.save();
    res.json(createdLog);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

module.exports = router;
