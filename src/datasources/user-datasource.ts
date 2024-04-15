import { IFindUserQuery, IUser, IUserCreationBody, IUserDataSource } from "../interfaces/user-interface";
import userModel from "../models/user-model";

class UserDataSource implements IUserDataSource {
    async create(record: IUserCreationBody): Promise<IUser> {
        return await userModel.create(record)
    }

    // Find one record
    async fetchOne(query: IFindUserQuery): Promise<IUser | null> {
        return await userModel.findOne(query)
    }
}

export default UserDataSource;