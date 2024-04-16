import Db from "./index"
import userModel from "../models/user-model"
import TokenModel from "../models/token-model"

const DbInitialize = async () => {
    try {
        // if you want to connect to the database
        await Db.authenticate()
        userModel.sync({alter: false})
        TokenModel.sync({alter: false})
    } catch(error) {
        console.log("Unable to connect to our database", error)
    }
}

export default DbInitialize;