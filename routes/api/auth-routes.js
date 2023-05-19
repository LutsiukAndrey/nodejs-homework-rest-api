const express = require("express");

const authControllers = require("../../controllers/auth-controllers");

const { schemas } = require("../../models/user");

const validateBody = require("../../utils/validateBody");

const router = express.Router();

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

module.exports = router;
