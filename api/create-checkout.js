import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICES = {
  monthly:   'price_1TdLE9JvSC4gQd6v8vAqkT7I',  // $199/mes
  quarterly: 'price_1TdM34JvSC4gQd6vZLFLadP0',  // $149/mes (3 pagos)
  annual:    'price_1TdM3yJvSC4gQd6vRpVppS1U',  // $99/mes  (12 pagos)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { planId, userEmail, origin } = req.body

  if (!PRICES[planId]) {
    return res.status(400).json({ error: 'Plan no válido' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICES[planId], quantity: 1 }],
      customer_email: userEmail || undefined,
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/?payment=canceled`,
      metadata: { planId, userEmail: userEmail || '' },
      locale: 'es',
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return res.status(500).json({ error: err.message })
  }
}
