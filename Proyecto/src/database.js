const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://andresnovmusica:coderhouse@cluster0.er55ipy.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Successful connection") )
    .catch(() => console.log("Connection Error"))