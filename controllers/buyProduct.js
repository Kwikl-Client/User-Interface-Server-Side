import { Stripe } from "stripe";
const billDetailsDatabase = {};
const productPrice = 80000; // Replace with the actual product price
// app.post("/api/create-checkout-session", async (req, res) => {
export const payment = async(req, res)=>{
    const stripe = new Stripe(process.env.STRIPE_SECRET);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Dummy Product",
            },
            unit_amount: productPrice, // Dummy price in cents (100.00 in INR)
          },
          quantity: 1, // Quantity of the dummy item
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/cancel",
    });

    // Save the bill details in the database (for demonstration purposes)
    billDetailsDatabase[session.id] = {
      items: [
        { name: "Dummy Product", price: 10000, quantity: 1 },
        // Add more items as needed
      ],
      totalAmount: 500000, // Calculate the total amount
    };

    console.log("Created session with ID:", session.id); // Add this log
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating session:", error); // Add this log
    res.status(500).json({ error: error.message });
  }
};