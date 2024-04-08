import bcrypt from "bcryptjs"
import {Request, Response} from "express";
import UserService from "../services/user-service";
import { AccountStatus, EmailStatus, UserRoles } from "../interfaces/enum/user-enum";
import { IUserCreationBody } from "../interfaces/user-interface";
import Utility from "../utils/index.utils";
import { ResponseCode } from "../interfaces/enum/code-enum";

class UserController {

    private userService:UserService

    constructor(_userService:UserService){ // It will take one parameter
        this.userService = _userService;
    }

    // structure the data
    // hash the password
    // create user
    // Generate a token for verification
    // sending the welcom/verification email
    async register(req : Request, res : Response) {
        try {
            const params = {...req.body}
            // structure the data
            const newUser = {
                firstname:params.firstname,
                lastname:params.lastname,
                email:params.email,
                username:params.email.split("@")[0],
                password:params.password,
                role:UserRoles.CUSTOMER,
                isEmailVerified:EmailStatus.NOT_VERIFIED,
                accountStatus:AccountStatus.ACTIVE
            } as IUserCreationBody;

            // Hash password
            newUser.password = bcrypt.hashSync(newUser.password, 10)

            // Validate or check if the email exist because we are gettting the username from the email
            // We will try to fetch the user from the database with that email
            let userExists = await this.userService.getUserByField({email: newUser.email})

            if(userExists) {
                return Utility.handleError(res, "Email already exists", ResponseCode.ALREADY_EXIST)
            }

            // Create User
            let user = this.userService.createUser(newUser)
            // I dont want it to send a password that was hashed, so we do
            user.password = ""

            return Utility.handleSuccess(res, "User Registered successfully", {user}, ResponseCode.SUCCESS)

            // res.send({message: "Registration successful"})
        } catch (error) {
            res.send({message: "Server Error"})
        }
    }

    async login(req : Request, res : Response) {
        try {
            res.send({message: "Login successful"})
        } catch (error) {
            res.send({message: "Server Error"})
        }
    }

    async forgotPassword(req : Request, res : Response) {
        try {
            res.send({message: "Forgot Password mail sent"})
        } catch (error) {
            res.send({message: "Server Error"})
        }
    }

    async resetPassword(req : Request, res : Response) {
        try {
            res.send({message: "Reset Password successful"})
        } catch (error) {
            res.send({message: "Server Error"})
        }
    }
}

export default UserController;