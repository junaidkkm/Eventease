// src/components/RazerPayButton.js
import React from "react";
import axios from "axios";

const PaymentButton = () => {
  const handlePayment = async () => {
    try {
      // 🔁 Step 1: Create Order from Backend
      const { data } = await axios.post("http://localhost:5001/api/payment/create-order", {
        amount: 500, // Amount in INR
        currency: "INR",
        receipt: "receipt#001",
      });

      console.log("📦 Order Response from Backend:", data);

      if (!data.order || !data.order.id) {
        alert("❌ Failed to create Razorpay order");
        return;
      }

      // 🔁 Step 2: Initialize Razorpay Checkout
      const options = {
        key: "rzp_test_WLIkcBbQ1HYKZR", // ✅ Your Razorpay Test Key ID
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "EventEase",
        description: "Payment for Booking",

        handler: function (response) {
          console.log("🎯 Razorpay Payment Success Response:", response);
          if (response.razorpay_payment_id) {
            alert("✅ Payment Successful!");
            // TODO: You can send this response to your backend to verify & save payment
          } else {
            alert("❌ Payment Failed. No payment ID returned.");
          }
        },

        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9876543210",
        },

        theme: {
          color: "#3399cc",
        },

        modal: {
          ondismiss: function () {
            console.warn("⚠️ Payment popup closed by user.");
            alert("❌ Payment cancelled.");
          },
        },
      };
       console.log("🧪 Razorpay Key:", options.key);
       
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("❌ Error during payment:", err.response?.data || err.message);
      alert("Oops! Something went wrong.\nPayment Failed");
    }
  };

  return <button onClick={handlePayment}>💳 Pay ₹500</button>;
};

export default PaymentButton;
