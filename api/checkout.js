const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { priceId, formData } = req.body;

  try {
    const encoded = Buffer.from(JSON.stringify(formData || {})).toString('base64');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/create?payment=cancelled`,
      metadata: {
        formData:  encoded.substring(0, 500),
        formData2: encoded.substring(500, 1000),
        formData3: encoded.substring(1000, 1500),
        formData4: encoded.substring(1500, 2000),
      }
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
