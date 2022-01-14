const mongoose = require("mongoose");
mongoose.
    connect(
        process.env.ATLAS_URI
        )
    .then(()=>console.log("connected to Mongo DB"))
    .catch((err)=>console.log("Failed to connect to Mongo DB",err));