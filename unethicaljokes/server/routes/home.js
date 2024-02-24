const pool = require("../db");
const redis = require("../redis");
const router = require("express").Router();
const auth = require("../middleware/auth");
const sendEmail = require("../utils/sendEmail");
const { body, validationResult } = require('express-validator');
const fetch = require("node-fetch");

//get all tweets from followers



module.exports = router;