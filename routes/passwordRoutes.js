const express = require("express");
const router = express.Router();
const {
  requestPasswordReset,
  verifyOTPAndResetPassword,
} = require("../controllers/passwordControllers");

router.post("/request-reset", requestPasswordReset);
router.post("/verify-reset", verifyOTPAndResetPassword);

module.exports = router;
