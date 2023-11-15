import React from "react";

function Docs() {
  return (
    <div className="p-3">
      <h3>DOCUMENTATION <span>OF</span></h3>
      <p className="text text-primary fs-4 fw-normal">
        REACT MPESA INTERGRATION by:
      </p>
      <h4 className="text">
        <em>Allan Kiplagat</em>
      </h4>
      <p className="mt-3">
        LIPA NA M-PESA ONLINE API also know as M-PESA express (STK Push) is a
        Merchant/Business initiated C2B (Customer to Business) Payment. I,
        Allan have gone through the unguided Safaricom Daraja API docs to
        finally be able to intergrate the LIPA NA M-PESA ONLINE API in as many
        languages & frameworks as posible, In this I have hereby intergrated the
        api to a REACTJS webapp directly from the clientside . Feel free to
        try the working prototype .
      </p>
      <p className="text fs-4 fw-light">TECHNOLOGIES USED</p>
      <span style={{ display: "flex" }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png"
          alt="mpesa"
          height={80}
          width={100}
          className="m-2"
        />
        <img
          src="https://ziprof.co.ke/assets/img/mpesa_api.png"
          alt="react"
          height={80}
          width={100}
          className="m-2"
        />
      </span>
      <p className="text fs-4 fw-normal">Need Help?</p>
      <p className="text fs-5 fw-light">Reach Out: 0710251692</p>
      <p className="text fs-5 fw-light">Github repo: <a href="https://github.com/Allan-Kipkemei/DarajaAPISTK-push">GitHub repo</a></p>

    </div>
  );
}

export default Docs;
