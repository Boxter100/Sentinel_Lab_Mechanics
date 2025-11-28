export const prerender = false;

import Stripe from "stripe";
const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export async function POST({ request }) {
  try {
    const { items } = await request.json();

    // convertir tus items a line_items de stripe
    const line_items = items.map(item => ({
      price_data: {
        currency: "mxn",
        product_data: { name: item.title },
        unit_amount: item.unit_price * 100, // Stripe maneja centavos
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${import.meta.env.SITE}/success`,
      cancel_url: `${import.meta.env.SITE}/cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
    });

  } catch (error) {
    console.error("[STRIPE ERROR]", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
