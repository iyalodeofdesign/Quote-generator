/* ==========================================================================
   QUOTE GENERATOR - EXPRESS & STRIPE BACKEND SERVER (server.js)
   Generates Stripe Checkout Sessions securely with secret key environment isolation
   ========================================================================== */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API Route: Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey || stripeSecretKey.includes('your_stripe_secret_key')) {
      return res.status(400).json({
        error: 'Stripe secret key is not configured on the server. Please set STRIPE_SECRET_KEY in your .env file.'
      });
    }

    // Initialize Stripe securely on the server
    const stripe = require('stripe')(stripeSecretKey);
    
    // Determine current domain dynamically or from environment
    const domain = process.env.DOMAIN || `${req.protocol}://${req.get('host')}`;

    // Generate Stripe Checkout Session for $5/month Premium Plan
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'QuoteVerse Premium Subscription',
              description: 'Unlimited quote access, unlimited saved quotes, personal collections & ad-free experience.',
            },
            unit_amount: 500, // $5.00 USD
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      // Redirect URLs configured to return user back to application
      success_url: `${domain}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/?payment=cancelled`,
    });

    // Send session details (URL & ID) back to client
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating Stripe Checkout Session:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate Stripe Checkout Session.'
    });
  }
});

// Serve frontend SPA fallback
app.get('{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 QuoteVerse server running securely on http://localhost:${PORT}`);
});
