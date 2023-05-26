const express = require("express");

const authControllers = require("../../controllers/auth-controllers");

const { schemas } = require("../../models/user");

const validateBody = require("../../utils/validateBody");

const router = express.Router();

const { authenticate, upload } = require("../../middelewares");

router.post(
  "/register",
  validateBody(schemas.userRegisterSchema),
  authControllers.register
);

router.post(
  "/login",
  validateBody(schemas.userLoginSchema),
  authControllers.login
);
router.get("/current", authenticate, authControllers.getCurrent);

router.post("/logout", authenticate, authControllers.logout);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authControllers.updateAvatar
);

module.exports = router;
