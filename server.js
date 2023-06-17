const express = require("express");
// const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;//prasath_token

app.listen(process.env.PORT, () => {
    console.log("webhook is listening on port ", process.env.PORT);
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];


    if (mode && token) {

        if (mode === "subscribe" && token === mytoken) {
            res.status(200).send(challange);
        } else {
            res.status(403);
        }

    }

});

app.use("/", require("./routes/index"));

app.get("/", (req, res) => {
    res.status(200).send("hello this is webhook setup");
});