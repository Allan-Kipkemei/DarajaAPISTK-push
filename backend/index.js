const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const moment = require('moment');
const cors = require('cors'); // Add this line
const User = require('./model');
const { connectToDatabase } = require('./db');


const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // Use the cors middleware

connectToDatabase();


async function getAccessToken() {
    const consumerKey = 'ApoIAalG8BzrrjVdN5xMfG2kyy4X5Ulh';
    const consumerSecret = 'YgrEljw7BqMClvcK';

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
        const phoneNumber = req.query.phoneNumber;
        const amount = req.query.amount;
        const accessToken = await getAccessToken();

        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const auth = `Bearer ${accessToken}`;
        const timestamp = moment().format("YYYYMMDDHHmmss");
        const password = new Buffer.from(
            "174379" + "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" + timestamp
        ).toString("base64");

        const response = await axios.post(url, {
            BusinessShortCode: "174379",
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: "254710251692",
            PartyB: "174379",
            PhoneNumber: phoneNumber,
            CallBackURL: "https://mydomain.com/path",
            AccountReference: "Alus Mabele",
            TransactionDesc: "Mpesa Daraja API stk push test",
        }, {
            headers: { Authorization: auth },
        });

        res.send("😀 Request is successfully done ✔✔. Please enter MPESA pin to complete the transaction");
    } catch (error) {
        console.error(error.message);
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
});

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
