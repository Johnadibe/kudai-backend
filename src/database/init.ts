import Db from "./index"

const DbInitialize = async () => {
    try {
        // if you want to connect to the database
        await Db.authenticate()
    } catch(error) {
        console.log("Unable to connect to our database", error)
    }
}

export default DbInitialize;