import { Model, Optional } from "sequelize";

export interface IUser{
    id:string;
    username:string;
    password:string;
    firstname:string;
    lastname:string;
    email:string;
    role:string;
    isEmailVerified:string;
    accountStatus:string;
    createdAt:Date;
    updatedAt:Date;
}

export interface IUserCreationBody extends Optional<IUser, "id" | "createdAt" | "updatedAt" >{}

export interface IUserModel extends Model<IUser, IUserCreationBody>, IUser{}

// This will be 
export interface IFindUserQuery {
    where : {
        [key:string] : string
    },
    raw?: boolean, // This means you want it to return a new data for you
    returning:boolean
}

// This is for the Data Source
export interface IUserDataSource{
    fetchOne(query:IFindUserQuery) : Promise<IUser | null>;
    create(record: IUserCreationBody) : Promise<IUser>;
}