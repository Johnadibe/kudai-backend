import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { Request, Response } from "express";
import UserService from "../services/user-service";
import {
  AccountStatus,
  EmailStatus,
  UserRoles,
} from "../interfaces/enum/user-enum";
import { IUserCreationBody } from "../interfaces/user-interface";
import Utility from "../utils/index.utils";
import { ResponseCode } from "../interfaces/enum/code-enum";
import TokenService from "../services/token-service";
import { IToken } from "../interfaces/token-interface";

class UserController {
  private userService: UserService;
  private tokenService: TokenService;

  constructor(_userService: UserService, _tokenService: TokenService) {
    // It will take one parameter
    this.userService = _userService;
    this.tokenService = _tokenService
  }

  // structure the data
  // hash the password
  // create user
  // Generate a token for verification
  // sending the welcom/verification email
  async register(req: Request, res: Response) {
    try {
      const params = { ...req.body };
      // structure the data
      const newUser = {
        firstname: params.firstname,
        lastname: params.lastname,
        email: params.email,
        username: params.email.split("@")[0],
        password: params.password,
        role: UserRoles.CUSTOMER,
        isEmailVerified: EmailStatus.NOT_VERIFIED,
        accountStatus: AccountStatus.ACTIVE,
      } as IUserCreationBody;

      // Hash password
      newUser.password = bcrypt.hashSync(newUser.password, 10);

      // Validate or check if the email exist because we are gettting the username from the email
      // We will try to fetch the user from the database with that email
      let userExists = await this.userService.getUserByField({
        email: newUser.email,
      });

      if (userExists) {
        return Utility.handleError(
          res,
          "Email already exists",
          ResponseCode.ALREADY_EXIST
        );
      }

      // Create User
      let user = await this.userService.createUser(newUser);
      // I dont want it to send a password that was hashed, so we do
      user.password = "";

      return Utility.handleSuccess(
        res,
        "User Registered successfully",
        { user },
        ResponseCode.SUCCESS
      );

      // res.send({message: "Registration successful"})
    } catch (error) {
      return Utility.handleError(
        res,
        (error as TypeError).message,
        ResponseCode.SERVER_ERROR
      );
    }
  }

  async login(req: Request, res: Response) {
    try {
      // Get the params from the request body
      const params = { ...req.body };

      // get the user record
      const user = await this.userService.getUserByField({
        email: params.email,
      });
      if (!user) {
        return Utility.handleError(
          res,
          "Invalid Login details",
          ResponseCode.NOT_FOUND
        );
      }

      // If we found the user then we should compare if the password match
      let isPasswordMatched = await bcrypt.compare(
        params.password,
        user.password
      );
      if (!isPasswordMatched) {
        return Utility.handleError(
          res,
          "Invalid Login details",
          ResponseCode.NOT_FOUND
        );
      }

      // So if it matches then we will create a token
      const token = JWT.sign(
        {
          firstname: user.firstname,
          lastname: user.lastname,
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_KEY as string,
        {
          expiresIn: "30d",
        }
      );

      return Utility.handleSuccess(
        res,
        "Login Successful",
        { user, token },
        ResponseCode.SUCCESS
      );
    } catch (error) {
      return Utility.handleError(
        res,
        (error as TypeError).message,
        ResponseCode.SERVER_ERROR
      );
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
        // First thing, Get our params
        const params = {...req.body}

        // confirm if does this user with this email exist
        let user = await this.userService.getUserByField({email: params.email})
        if (!user) {
            return Utility.handleError(res, "Account does not exist", ResponseCode.NOT_FOUND)
        }

        // If the user exist then we will generate a token
        const token = await this.tokenService.createForgotPasswordToken(params.email) as IToken;
        // await EmailService.sendForgotPasswordMail(params.email, token.code)

        return Utility.handleSuccess(res, "Password reset code has been sent to your mAIL", {}, ResponseCode.SUCCESS)
    } catch (error) {
      return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR)
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      res.send({ message: "Reset Password successful" });
    } catch (error) {
      res.send({ message: "Server Error" });
    }
  }
}

export default UserController;
