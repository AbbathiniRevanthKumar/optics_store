const passport = require("../../config/passport.config");
const oAuthController = require("../../controllers/OAuth/oauth.controller");
const passportController = require("../../controllers/OAuth/passport.controller");

const   router = require("express").Router();

//basic google login
// router.get("/google", oAuthController.mainRoute);
// router.get("/google/auth/google", oAuthController.googleLoginPage);
// router.get("/google/callback", oAuthController.goggleCallBack);

//passportRoutes
router.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  passportController.userLogin
);

module.exports = router;
