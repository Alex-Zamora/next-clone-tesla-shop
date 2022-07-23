import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
  numberOfOrders: number;
  paidOrders: number; // isPaid: true
  notPaidOrders: number;
  numberOfClients: number; // role: client
  numberOfProducts: number;
  productsWithNoInventory: number; // inStock 0
  lowInventory: number; // productos con 10 o menos inStock
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  
  return getData(req ,res);
}

const getData = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  await db.connect();

  // const numberOfOrders = await Order.countDocuments({}).exec();
  // // const numberOfOrders = await Order.count();
  // const paidOrders = await Order.countDocuments({ isPaid: true }).exec();
  // // const paidOrders = await Order.find({ isPaid: true }).count();
  // const notPaidOrders = numberOfOrders - paidOrders;
  // const numberOfClients = await User.countDocuments({ role: 'client' }).exec();
  // const numberOfProducts = await Product.countDocuments({}).exec();
  // const productsWithNoInventory = await Product.find({ inStock: 0 }).count();
  // // const productsWithNoInventory = await (await Product.find({})).filter(({ inStock }) => inStock === 0).length;
  // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();
  // // const lowInventory = await (await Product.find({})).filter(({ inStock }) => inStock <= 10).length;

  const [
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  ] = await Promise.all([
    Order.count(),
    Order.find({ isPaid: true }).count(),
    User.find({ role: 'client' }).count(),
    Product.find({}).count(),
    Product.find({ inStock: 0 }).count(),
    Product.find({ inStock: { $lte: 10 } }).count()
  ]);

  await db.disconnect();


  
  return  res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory
  });

}