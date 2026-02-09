const express = require('express')
const app = express()
const port = 8080

app.use(express.json())

//test controller
app.get('/',(req,res)=>{
    res.status(500).json("why you testing your routes bro, do you not know if the server is running");
})

app.listen(port,()=>
    console.log(`Server running on http://localhost:8080`)
)