import { Stripe } from "stripe";
const billDetailsDB = {};

export const offerpayment = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET);
  
  // Assuming you have a way to fetch customers from your database
  const customers = []; // Replace this with actual customer data from your database

  try {
    const offersession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Dummy Product",
            },
            unit_amount: calculateUnitAmount(customers.length), // Pass the customer count to calculateUnitAmount
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/cancel",
    });
    billDetailsDB[offersession.id] = {
      items: [
        { name: "Dummy Product", price: calculateUnitAmount(customers.length) / 100, quantity: 1 },
      ],
      totalAmount: calculateUnitAmount(customers.length) / 100,
    };

    console.log("Created session with ID:", offersession.id);
    res.json({ id: offersession.id });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: error.message });
  }

  function calculateUnitAmount(customerCount) {
    const originalUnitPrice = 50000;
    if (customerCount <= 100) {
      return originalUnitPrice / 2;
    } else {
      return originalUnitPrice;
    }
  }
};
