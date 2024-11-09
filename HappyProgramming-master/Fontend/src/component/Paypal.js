import React, { useEffect, useRef, useState } from "react";
import { FIXED_PRICE } from "../constants/constant";
import {message} from "antd";

const PayPalButton = ({ description, onUpdate }) => {
  const paypalRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load the PayPal SDK script dynamically
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AUCYX-PkQ63jmGseKSc8BA8-foTwvQcgxHBiwWnx9AEGuzXjTc8ERPcI1g_VaA70dtuMfBbBCNzo2yms&buyer-country=US&currency=USD&components=buttons";
    script.addEventListener("load", () => setLoaded(true));
    document.body.appendChild(script);

    return () => {
      // Clean up by removing the script when the component is unmounted
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (loaded && window.paypal) {
      window.paypal
        .Buttons({
          style: {
            width: "30%",
            shape: "pill",
            layout: "horizontal",
            color: "blue",
            label: "paypal",
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: description,
                  amount: {
                    currency_code: "USD",
                    value: FIXED_PRICE,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            if (order.status === "COMPLETED") {
              onUpdate(order);
            } else {
                message.success("Transaction failed to complete.");
            }
          },
          onError: (err) => {
            console.error("PayPal button error:", err);
            message.error("An error occurred with the PayPal transaction.");
          },
        })
        .render(paypalRef.current);
    }
  }, [loaded, description, onUpdate]);

  return <div ref={paypalRef}></div>;
};

PayPalButton.defaultProps = {
  price: 0,
  description: "",
  onUpdate: () => {},
};

export default PayPalButton;
