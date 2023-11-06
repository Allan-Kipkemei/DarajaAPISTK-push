import React, { useState } from "react";
import axios from "axios";

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
    if (details.phone.length !== 10) {
      return alert("Invalid phone number ");
    }
    if (details.phone.substring(0, 2) !== "07" && details.phone.substring(0, 2) !== "01") {
      return alert("Valid number should start with 07 or 01");
    }

    // Make a post request to save user data
    axios
      .post("http://localhost:8000/UserData", details)
      .then((response) => {
        console.log(response.data);

        initiateStkPush(details.phone, details.amount);
      })
      .catch((error) => {
        console.error(error.message);
        // Handle the error
      });
  };

  const initiateStkPush = (phone, amount) => {
    axios
      .get(`http://localhost:8000/stkpush?phone=${phone}&amount=${amount}`)
      .then((response) => {
        console.log(response.data);

        // Handle the response from STK push
      })
      .catch((error) => {
        console.error(error);
        // Handle the error
      });
  };

  return (
    <div className="card p-4 mb-3">
      <h2 className="text-center">Lipa na M-Pesa (STK Push)</h2>
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
        <button
          onClick={handlePay}
          type="submit"
          className="btn btn-primary btn-block"
        >
          PAY
        </button>
      </form>
    </div>
  );
}

export default PayPage;
