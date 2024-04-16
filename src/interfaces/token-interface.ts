import { Model, Optional } from "sequelize";

export interface IToken{
    id:string;
    key:string; // The key is used to know what this token is meant for
    code:string; // The actual code which is the token itself
    type:string; // This type helps us to know if it is a forgot password token or reset password token, etc
    expires: Date
    status: string // If it used or not used
    createdAt:Date;
    updatedAt:Date;
}

// This will be 
export interface IFindTokenQuery {
    where : {
        [key:string] : string
    },
    raw?: boolean, // This means you want it to return a new data for you
    returning:boolean
}

export interface ITokenCreationBody extends Optional<IToken, "id" | "createdAt" | "updatedAt" >{}

export interface ITokenModel extends Model<IToken, ITokenCreationBody>, IToken{}

// This is for the Data Source
export interface ITokenDataSource{
    fetchOne(query:IFindTokenQuery) : Promise<IToken | null>;
    create(record: ITokenCreationBody) : Promise<IToken>;
    // we will be needing an updateOne
    updateOne(data: Partial<IToken>, query: IFindTokenQuery) : Promise<void>
}
