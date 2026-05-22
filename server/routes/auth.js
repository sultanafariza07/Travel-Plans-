const express = require("express");
const router = express.Router();
const passport = require("passport"); // ✅ ADD THIS
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// ================= NORMAL AUTH =================

// @route   POST api/auth/register
router.post("/register", authController.register);

// @route   POST api/auth/login
router.post("/login", authController.login);

// @route   GET api/auth/profile
router.get("/profile", auth, authController.getProfile);

// @route   PUT api/auth/profile
router.put("/profile", auth, authController.updateProfile);

// @route   PUT api/auth/change-password
router.put("/change-password", auth, authController.changePassword);

// @route   POST api/auth/request-email-change
router.post("/request-email-change", auth, authController.requestEmailChange);

// @route   POST api/auth/verify-email-change
router.post("/verify-email-change", auth, authController.verifyEmailChange);

// @route   GET api/auth/email-change-status
router.get("/email-change-status", auth, authController.getEmailChangeStatus);

// @route   POST api/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// @route   PUT api/auth/reset-password/:token
router.put("/reset-password/:token", authController.resetPassword);

// @route   POST api/auth/verify-otp
router.post("/verify-otp", authController.verifyOtp);

// @route   POST api/auth/resend-otp
router.post("/resend-otp", authController.resendOtp);

// @route   POST api/auth/otp-status
router.post("/otp-status", authController.getOtpStatus);

// ================= GOOGLE AUTH (🔥 FIX) =================

// STEP 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// STEP 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false, // if using JWT
  }),
  (req, res) => {
    // ✅ Debug
    console.log("Google User:", req.user);

    // 👉 If using JWT, generate token here
    const token = req.user.token; // depends on your implementation

    // 👉 Redirect to frontend with token
    res.redirect(`http://localhost:3000/?token=${token}`);
  },
);

module.exports = router;
