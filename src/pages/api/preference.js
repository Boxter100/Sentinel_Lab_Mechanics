export const prerender = false;

import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST({ request }) {
  try {
    console.log('[DEBUG] SITE en backend:', import.meta.env.SITE);
    const { items } = await request.json(); // recibe array completo

    const client = new MercadoPagoConfig({
      accessToken: import.meta.env.MP_ACCESS_TOKEN,
    });

    const preference = await new Preference(client).create({
      body: {
        items, // ya es un array de productos
        back_urls: {
          success: `${import.meta.env.SITE}/success`,
          failure: `${import.meta.env.SITE}/failure`,
          pending: `${import.meta.env.SITE}/pending`
        },
        auto_return: 'approved',
      },
    });

    //console.log('Preferencia creada:', preference);  // Agrega este log para verificar la preferencia creada

    return new Response(JSON.stringify({ initPoint: preference.init_point }), {
      status: 200,
    });

  } catch (error) {
    console.error('[BACKEND] Error al crear preferencia:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
