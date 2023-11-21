import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PayPage() {
  const [details, setDetails] = useState({
    phone: "",
    amount: "",
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handlePay = async (e) => {
    e.preventDefault();

    // Validation

    if (!details.amount || !details.phone) {
      return alert("Please fill in all fields.");
    }
    if (details.amount < 1) {
      return alert("Please enter a valid amount.");
    }
    if (details.phone.length !== 12) {
      return alert("Invalid phone number. Phone number should be 12 characters long.");
    }
    if (details.phone.substring(0, 3) !== "254") {
      return alert("Valid number should start with '254'.");
    }
    if (details.phone.substring(3, 5) !== "70" && details.phone.substring(3, 5) !== "71") {
      return alert("Valid number should start with '70' or '71' after the country code.");
    }

    // Make a post request to save user database
    axios
      .post("https://stkpush-yryy.onrender.com", details)
      .then((response) => {
        console.log(response.data);

        initiateStkPush(details.phone, details.amount);
      })
      .catch((error) => {
        console.log(error.message , "namna gani huku");
        // Handle the error
      });
  };

  const initiateStkPush = async (phone, amount) => {
    try {
    
      const response = await axios.get(`https://stkpush-yryy.onrender.com/stkpush?phone=${phone}&amount=${amount}`);

      // Check the HTTP status code for success (e.g., 200).
      if (response.status === 200) {
        console.log('STK push response:', response.data);
        // Handle the response from STK push here.
        toast.success('STK push has been sent to your phone');
      } else {
        console.error(`STK push failed with status code ${response.status}`);
        // Handle the error appropriately.
      }
    } catch (error) {
      console.error('An error occurred while making the STK push request:', error);
      // Handle the error appropriately.
    }
  };

  return (
    <div className="card p-4 mb-3">
      <h2 className="text-center">Give it a try</h2>
      <form>
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
            placeholder="e.g., 254710251692"
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
        <button
          onClick={handlePay}
          type="submit"
          className="btn btn-primary btn-block"
        >
          PAY: KSH {details.amount}/=
        </button>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default PayPage;
