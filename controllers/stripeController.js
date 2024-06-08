const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.stripePayment = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ validationError: "No request body" });
    }

    if (!req.body.productTitle) {
        return res.status(400).json({ validationError: "productTitle is required as a string" });
    }
    if (!req.body.productPrice) {
        return res.status(400).json({ validationError: "productPrice is required as a number" });
    }
    if (!req.body.quantity) {
        return res.status(400).json({ validationError: "quantity is required as a number" });
    }

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
        res.status(500).json({ error: err.message });
    }
};
