import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Order } from '../../../models';
import Product from '../../../models/Product';

type Data =
| { message: string }
| IOrder;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);
  
    default:
      return res.status(400).json({ message: 'Bad request' })
  }
  
}

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { orderItems, total } = req.body as IOrder;

  // verificar sesión del usuario 
  const session: any = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'usuario no autenticado' });
  }

  // Crear un arreglo con los productos del usuario
  const productsIds = orderItems.map( product => product._id);
  await db.connect();

  // buscar los ids del orderItems que coincidan en la colección de productos
  const dbProducts = await Product.find({ _id: { $in: productsIds } });  

  try {
    const subTotal = orderItems.reduce( (prev, current) => {
      // en cada iteración se itera una vez más para encontrar el producto de la DB que coincida 
      // con el producto del cliente y si existe coincidencia regresa el precio que se tiene en la base de datos
      const currentPrice = dbProducts.find( prod => prod.id === current._id )?.price;
      
      if ( !currentPrice ) {
        throw new Error('Verifique el carrito de nuevo, producto no existe');
      }

      // calcular subtotal del lado del backend, usando el precio de la DB
      return (currentPrice * current.quantity) + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * (taxRate + 1);

    if ( total !== backendTotal ) {
      throw new Error('El total no cuadra con el monto');
    }

    // todo bien hasta este punto
    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    // redondear a dos decimales
    newOrder.total = Math.round( newOrder.total * 100 ) / 100;
    await newOrder.save();
    await db.disconnect();

    return res.status(201).json( newOrder )

  } catch (error: any ) {
    console.log("error ", error);
    await db.disconnect();
    res.status(400).json({
      message: error.message || 'Revisar logs del servidor'
    });
  }
  


  return res.status(201).json( session );
}
