const express = require("express");
const router =  express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post('/payment', async (req, res) => {
    const source = req.body.tokenId;
    const amount = req.body.amount;
    const currency = "usd";
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        source,
        amount,
        currency,
      });
  
      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

module.exports = router