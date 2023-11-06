import React, { useState } from "react";
import axios from "axios";
import moment from 'moment'

function PayPage() {
  const [details, setDetails] = useState({
    phone: "",
    amount: "",
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!details.amount || !details.phone) {
      return alert("Please fill in all fields.");
    }
    if (details.amount < 1) {
      return alert("Please enter a valid amount.");
    }
    if (details.phone.length !== 10 || !/^07\d{8}$/.test(details.phone)) {
      return alert("Please enter a valid 10-digit phone number starting with 07.");
    }

    // Request access token
    try {
      const consumerKey = "YOUR_CONSUMER_KEY"; // Replace with your consumer key
      const consumerSecret = "YOUR_CONSUMER_SECRET"; // Replace with your consumer secret
      const credentials = `${consumerKey}:${consumerSecret}`;
      const base64Credentials = Buffer.from(credentials).toString("base64");
      const timestamp = moment().format("YYYYMMDDHHmmss");

      const tokenResponse = await axios.post(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate",
        {},
        {
          headers: {
            Authorization: `Basic ${base64Credentials}`,
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Prepare STK push request
      const stkPushData = {
        BusinessShortCode: "YOUR_BUSINESS_SHORTCODE", // Replace with your business short code
        Password: "YOUR_PASSWORD", // Replace with your Lipa na M-Pesa online password
        Timestamp: timestamp , // Replace with the current timestamp
        TransactionType: "CustomerPayBillOnline",
        Amount: details.amount,
        PartyA: details.phone,
        PartyB: "600000", // Replace with your PayBill number
        PhoneNumber: details.phone,
        CallBackURL: "https://mydomain.com/path", // Replace with your callback URL
        AccountReference: "Payment",
        TransactionDesc: "Payment of X",
      };

      const stkPushResponse = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        stkPushData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(stkPushResponse);
      // Handle the response as needed
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="card p-4 mb-3">
      <h2 className="text-center">Lipa na M-Pesa (STK Push)</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone Number:
          </label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={details.phone}
            onChange={handleChange}
            placeholder="e.g., 0710251692"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">
            Amount (Ksh):
          </label>
          <input
            type="number"
            className="form-control"
            name="amount"
            value={details.amount}
            onChange={handleChange}
            placeholder="Enter amount"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          PAY
        </button>
      </form>
    </div>
  );
}

export default PayPage;
