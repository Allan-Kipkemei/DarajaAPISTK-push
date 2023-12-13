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
      return toast.error("Please fill in all fields.");
    }
    if (details.amount < 1) {
      return toast.error("Please enter a valid amount.");
    }
    if (details.phone.length !== 12 || !details.phone.startsWith("254")) {
      return toast.error("Invalid phone number format.");
    }

    try {
      const response = await axios.post("http://localhost:8000/UserData", details, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // const response = await axios.post("https://stkpush-yryy.onrender.com/UserData", details, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      console.log(response.data);
      initiateStkPush(details.phone, details.amount);
    } catch (error) {
      console.error('Error saving user data:', error.message);
      toast.error('An error occurred while processing your request.');
    }
  };

  const initiateStkPush = async (phone, amount) => {
    try {


      const response = await axios.get(`http://localhost:8000/stkpush?phone=${phone}&amount=${amount}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // const response = await axios.get(`https://stkpush-yryy.onrender.com/stkpush?phone=${phone}&amount=${amount}`, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      if (response.status === 200) {
        console.log('STK push response:', response.data);
        toast.success('STK push has been sent to your phone');
      } else {
        console.error(`STK push failed with status code ${response.status}`);
        toast.error('Failed to initiate STK push. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred while making the STK push request:', error);
      toast.error('Failed to initiate STK push. Please try again.');
    }
  };

  return (
    <div className="card p-4 mb-3">
      <h2 className="text-center">Give it a try</h2>
      <form onSubmit={handlePay}>
        {/* Input components can be extracted for better structure */}
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
        <button type="submit" className="btn btn-primary btn-block">
          PAY: KSH {details.amount}/=
        </button>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default PayPage;
