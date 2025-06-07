const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://donation-stripe.netlify.app"
}));
app.use(express.json());
app.use(express.static("public"));

app.post("/create-checkout-session", async (req, res) => {
  const { amount } = req.body;
console.log("Requested amount:", amount);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "myr",
          product_data: { name: "Donation" },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: "https://donation-stripe.netlify.app/success.html",
      cancel_url: "https://donation-stripe.netlify.app/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "err.message" });
  }
});

app.listen(4242, () => console.log("Server running on http://localhost:4242"));
