const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const moment = require('moment');
const cors = require('cors'); // Add this line
const User = require('./model');
require('dotenv').config()
const { connectToDatabase } = require('./db');
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // Use the cors middleware
//connect to db
connectToDatabase();

//init get access token
async function getAccessToken() {

    const consumerKey = process.env.CONSUMER_KEY ;
    const consumerSecret = process.env.CONSUMER_SECRET ;

    const auth = `Basic ${Buffer.from(consumerKey + ":" + consumerSecret).toString("base64")}`;
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    try {
        const response = await axios.get(url, {
            headers: { Authorization: auth },
        });
        return response.data.access_token;
    } catch (error) {
        console.log(error.message);
    }
}

app.get('/', (req, res) => {
    res.send('Implementation of Mpesa STK push');

    const timestamp = moment().format('YYYYMMDDmmss');
    console.log(timestamp);
});

app.get("/access_token", async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        res.send(`😀 Your access token is ${accessToken}`);
    } catch (error) {
        res.status(500).send(`❌ Error: ${error.message}`);
    }
});


app.get("/stkpush", async (req, res) => {
    try {
         const phone_number = req.query.phone;
         const ksh_amount = req.query.amount;
        const accessToken = await getAccessToken();
        console.log(accessToken);
        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const auth = `Bearer ${accessToken}`;
        const timestamp = moment().format("YYYYMMDDHHmmss");
        const password = new Buffer.from(
            "174379" + "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" + timestamp
        ).toString("base64");

        axios.post(url, {
            BusinessShortCode: "174379",
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: ksh_amount,
            PartyA: '600988',
            PartyB: '174379',
            PhoneNumber: phone_number,
            CallBackURL: "https://mydomain.com/path",
            AccountReference: "E-PAy",
            TransactionDesc: "Mpesa Daraja API stk push test",


        }, {
            headers: { Authorization: auth },
        });


        res.send("😀 Request is successfully done ✔✔. Please enter MPESA pin to complete the transaction");
    } catch (error) {
        console.error('Something went wrong.....'
            , error.message);
        res.status(500).send("❌ Request failed");


    }
});
app.post('/mpesa/callback', async (req, res) => {
    try {
        const transactionStatus = req.body.Body.stkcallback.ResultCode;
        if (transactionStatus === '0') {
            res.status(200).send('Successful transaction');
        } else {
            console.log('Failed', req.body.Body.stkcallback.ResultDesc);
            res.status(400).send('❌ Transaction failed. Check the M-Pesa status.');
        }
    } catch (error) {
        console.error('❌ Error in processing M-Pesa callback:', error);
        res.status(500).send('❌ Internal Server Error. Contact support.');
    }
})

app.post("/UserData", async (req, res) => {
    try {
        const { phone, amount } = req.body;
        const timestamp = new Date();
        console.log(timestamp);
        const newUser = new User({
            phone,
            amount,
            createdAt: timestamp,
        });
        await newUser.save();
        res.status(200).json({ message: "User data added successfully to the database" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding user data to the database" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});