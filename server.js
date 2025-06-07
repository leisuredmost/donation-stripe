const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.sk_test_51RWyP9CXBXthrLwjrOjXvt7dOuqrWUVWdYkaZW0QR7HiWZQ06stQM78Loa0RXXr6BPBYjyeS0vGjwlMGHkY1CAcz00ueLVY36y);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/create-checkout-session", async (req, res) => {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "myr",
          product_data: { name: "Donation" },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: "https://your-frontend-url.netlify.app/success.html",
      cancel_url: "https://your-frontend-url.netlify.app/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(4242, () => console.log("Server running on http://localhost:4242"));
