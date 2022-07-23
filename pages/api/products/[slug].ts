import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Product } from '../../../models';
import { IProduct } from '../../../interfaces/products';

type Data = 
  | { message: string }
  | IProduct

export default function async (req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case "GET":
      return getProduct(req, res);
    default:
      return res.status(400).json({ message: "El método no existe"});
  }
}

const getProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug } = req.query;

  await db.connect();
  const product = await Product.findOne({ slug })
                                .select('-_id')
                                .lean();
  await db.disconnect();

  if (!product) {
    return res.status(400).send({ message: "No hay producto con este slug" });
  }
  return res.status(200).json(product);

}
