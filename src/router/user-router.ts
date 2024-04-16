import express, { Request, Response } from "express";
import UserController from "../controllers/user-controller";
import UserService from "../services/user-service";
// import Utility from "../utils/index.utils";
import { validator } from "../middlewares/index.middleware";
import ValidationSchema from "../validators/user-validator-schema";
import UserDataSource from "../datasources/user-datasource";
import TokenService from "../services/token-service";
import TokenDataSource from "../datasources/token-datasource";

const createUserRoute = () => {
  const router = express.Router();
  const tokenService = new TokenService(new TokenDataSource())
  const userService = new UserService(new UserDataSource());
  const userController = new UserController(userService, tokenService);

  // Utility.printRed("POST : /api/user/register")
  // Post Route for register
  router.post(
    "/register",
    validator(ValidationSchema.registerSchema),
    (req: Request, res: Response) => {
      return userController.register(req, res);
    }
  );

  // Utility.printRed("POST : /api/user/login")
  // Post Route for login
  router.post("/login", validator(ValidationSchema.loginSchema), (req: Request, res: Response) => {
    return userController.login(req, res);
  });

  // Utility.printRed("POST : /api/user/forgot-password")
  // Post Route for forgot-password
  router.post("/forgot-password", validator(ValidationSchema.forgotPasswordSchema), (req: Request, res: Response) => {
    return userController.forgotPassword(req, res);
  });

  // Utility.printRed("POST : /api/user/reset-password")
  // Post Route for reset-password
  router.post("/reset-password", (req: Request, res: Response) => {
    return userController.resetPassword(req, res);
  });

  return router;
};

export default createUserRoute();
