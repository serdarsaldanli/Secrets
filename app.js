//jshint esversion:6
require("dotenv").config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
mongoose.set('strictQuery', false)
const encrypt = require("mongoose-encryption")

const app = express()

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})

const User = new mongoose.model("User", userSchema)


app.get("/", (req, res) => {
  res.render("home")
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.get("/register", (req, res) => {
  res.render("register")
})

app.post("/register", (req, res) => {

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save((err) => {
    if (err) {
      console.log(err)
    } else {
      res.render("secrets")
    }
  })
})

app.post("/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        } else{
          console.log("The password you entered doesn't match our records.");
        }
      }
    }
  })
})




app.listen(3000, (req, res) => {
  console.log("Server started on port 3000.");
})