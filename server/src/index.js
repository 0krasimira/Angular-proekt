const expressConfigurator = require("./config/expressConfigurator")
const express = require("express")
const mongoose = require("mongoose")
const router = require('./controllers/paintingController')

const app = express()
expressConfigurator(app)


app.use((req, res,next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
    next()
})

app.use(router)

mongoose.connect("mongodb://127.0.0.1:27017/proekt").then(() => {console.log("DB connected succesfully.");
app.listen(3000, () => 
    console.log(`Server is listening on port ${3000}...`))
}).catch(err => console.log("Cannot connect to DB."))


