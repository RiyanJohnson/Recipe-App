const express = require('express')
const app = express()
const connectDb = require("./db/db.js");
const port = 8080
const authRoute = require("./routes/authRoute.js")
const recipeRoute = require("./routes/recipeRoute.js")
require("dotenv").config();

connectDb();

app.use(express.json())

//test controller
app.get('/test',(req,res)=>{
    res.status(500).json("why you testing your routes bro, do you not know if the server is running");
})

app.use("/auth",authRoute);
app.use("/recipe",recipeRoute)

app.listen(port,()=>
    console.log(`Server running on http://localhost:8080`)
)