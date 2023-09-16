const mongoose = require("mongoose");

const databaseConnection = async (callback) => {
    try{
        if(process.env.DATABASE_URL){
            const client = await mongoose.connect(process.env.DATABASE_URL);
            // console.log(client.ConnectionStates);
            if(client){
                console.log("Database connected");
                callback();

            }
            else{
                console.log("Database url not connected");
            }
        }
    }catch(error){
        console.log(error);
    }
};

module.exports = databaseConnection;