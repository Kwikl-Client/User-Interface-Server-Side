const stripe = require('stripe')('your_stripe_secret_key');

app.post('/stripe-webhook', async (req, res) => {
  const payload = req.body;

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers['stripe-signature'],
      'we_1Nk2ZFJxY7bRUByPWHiniJe9'
    );

    // Handle specific events and send emails
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      // Send email for successful payment
      sendPaymentSuccessEmail(paymentIntent);
    }

    res.status(200).end();
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(400).send('Webhook Error');
  }
});
