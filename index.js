require("dotenv").config();
const express = require("express");
const helmet = require('helmet')
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_BASE_URL,
  optionsSuccessStatus: 200,
};

app.use(helmet())
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: req.body.productTitle,
            },
            unit_amount: req.body.productPrice * 100,
          },
          quantity: req.body.quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_BASE_URL}/success`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/cancel`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Error creating stripe checkout session: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
