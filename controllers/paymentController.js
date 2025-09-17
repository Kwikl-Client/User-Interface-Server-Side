import { configDotenv } from "dotenv";
import Stripe from "stripe";
import moment from 'moment';
import customerModel from "../models/customerModel.js";

configDotenv();
export const stripe = Stripe(process.env.STRIPE_SECRET);
export const packages = {
  comYearly: process.env.STRIPE_PRICE_ID_COMMUNITY_YEARLY,
  jumbo: process.env.STRIPE_PRICE_ID_BOOK_CHAT_JUMBO_YEARLY,
  comMonthly: process.env.STRIPE_PRICE_ID_COMMUNITY_MONTHLY,
};
export const createPaymentIntentForBook = async (req, res) => {
  try {
    const { email } = req.query;

    const priceId = process.env.STRIPE_PRICE_ID_BOOK_YEARLY;
    const trialPeriodDays = 7;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: trialPeriodDays,
      },
      allow_promotion_codes: true,
      success_url: `https://salssky.com/success?email=${email}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://salssky.com`,
      customer_email: email,
    });

    return res.status(200).json({
      success: true,
      message: "Subscription checkout session created successfully",
      data: session,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
};


export const PaymentIntentToAuthor = async (req, res) => {
    try {
        const { email, meetingId, type } = req.body;

        const customer = await customerModel.findOne({ email });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
                data: null,
            });
        }

        // Set unit amount based on role type
        let unitAmount;
        if (type === 'participant') {
            unitAmount = 4999; // $49.99
        } else if (type === 'audience') {
            unitAmount = 1999; // $19.99
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid type. Must be 'participant' or 'audience'.",
                data: null,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Talk To A STAR",
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `https://salssky.com/meetings?success=true&email=${email}&session_id={CHECKOUT_SESSION_ID}&meetingId=${meetingId}&role=${type}`,
            cancel_url: `https://salssky.com/meetings?success=false`,
            customer_email: email,
        });

        return res.status(200).json({
            success: true,
            message: "Payment checkout session created successfully",
            data: session,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null,
        });
    }
};

export const retrievePaymentDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return res.status(200).json({ success: true, message: 'payment data retrived successfully', data: session });
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Internal Server error', data: null });
  }
}

export const cancelSubscription = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the customer in your database
    const customer = await customerModel.findOne({ email });

    if (!customer || !customer.stripeDetails || !customer.stripeDetails.sessionId) {
      return res.status(400).json({ success: false, message: 'Customer or subscription not found' });
    }

    // Retrieve the session to get the subscription ID
    const session = await stripe.checkout.sessions.retrieve(customer.stripeDetails.sessionId);
    const subscriptionId = session.subscription;

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: 'Subscription not found for this customer' });
    }

    // Cancel the subscription at the end of the current billing period
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Optionally update the customer record in your database (if needed)
    customer.subscriptionDetails.cancel_at_period_end = true;
    await customer.save();

    return res.status(200).json({ success: true, message: 'Subscription set to cancel at the end of the current billing cycle', data: updatedSubscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', data: null });
  }
};
export const expireCheckoutSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Expire the checkout session using the Stripe API
    const expiredSession = await stripe.checkout.sessions.expire(sessionId);

    return res.status(200).json({
      success: true,
      message: 'Checkout Session expired successfully',
      data: expiredSession
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      data: null
    });
  }
};
// export const getCurrency = async (ip) => {
//   try {
//     const response = await axios.get(`http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}`);
//     const countryCode = response.data.country_code;
//     const currencyMap = {
//       US: 'usd',
//       IN: 'inr',
//       EU: 'eur',
//       // Add more mappings as needed
//     };
//     return currencyMap[countryCode] || 'usd';
//   } catch (error) {
//     console.error('Error fetching currency:', error);
//     return 'usd';
//   }
// };

// export const createSubscription = async (req, res) => {
//   try {
//     const { packageType, email } = req.body;

//     if (!packages[packageType]) {
//       return res.status(400).send({ error: 'Invalid package type' });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       success_url: 'http://localhost:5173/community',
//       cancel_url: 'http://localhost:5173/',
//       line_items: [
//         {
//           price: packages[packageType],
//           quantity: 1,
//         },
//       ],
//       mode: 'subscription',
//       customer_email: email,
//       client_reference_id: email,
//     });

//     const customer = await customerModel.findOne({ email });

//     if (!customer) {
//       return res.status(404).send({ error: 'Customer not found' });
//     }

//     customer.stripeDetails.push({
//       sessionId: session.id,
//       packageType: packageType,
//     });

//     customer.subscriptionDetails.push({
//       sessionId: session.id,
//       packageType: packageType,
//       subscriptionId: session.subscription, // Add subscription ID from Stripe session
//     });

//     await customer.save();

//     res.json({ url: session.url, sessionId: session.id });
//   } catch (e) {
//     console.error('Error creating checkout session:', e.message);
//     res.status(500).json({ error: e.message });
//   }
// };

export const updateSubscription = async (req, res) => {
  const { subscriptionId } = req.query; // Subscription ID from query parameters
  const { packageType } = req.body; // Package type: 'monthly', 'yearly', 'jumbo'

  try {
    // Check if the packageType is valid
    if (!packages[packageType]) {
      return res.status(400).json({ erroyr: 'Invalid package type' });
    }

    // Fetch the subscription to get the current subscription item ID
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionItemId = subscription.items.data[0].id; // Assuming only one item

    // Update the subscription with the new price ID from the packages config
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscriptionItemId, // Current subscription item ID
        price: packages[packageType], // New price ID based on the package type
      }],
      proration_behavior: 'none', // Handle billing proration
      billing_cycle_anchor: 'now', // Reset billing cycle to start now
    });

    // Update the subscription details in MongoDB
    const updatedCustomer = await customerModel.findOneAndUpdate(
      { 'subscriptionDetails.subscriptionId': subscriptionId },
      {
        'subscriptionDetails.packageType': packageType, // Save new package type
        'subscriptionDetails.sessionId': updatedSubscription.id, // Update session ID if needed
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      message: 'Subscription updated successfully',
      subscription: updatedSubscription,
      updatedCustomer: updatedCustomer,
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: error.message });
  }
};
export const retrieveSubscriptionDetails = async (req, res) => {
  try {
    const { subscriptionId } = req.params; // Use req.params instead of req.query
    console.log(subscriptionId);
    if (!subscriptionId) return res.status(400).json({ error: 'Subscription ID is required' });

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    res.status(500).json({ error: 'Failed to retrieve subscription details' });
  }
}
