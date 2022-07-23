import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'PUT':
      return updateProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }

}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  await db.connect();

  const products = await Product.find()
    .sort({ title: 'asc' })
    .lean();

  await db.disconnect();

  // TODO: actualizar las imagenes
  const updatedProducts = products.map( product => { 
    product.images = product.images.map(image => {
      return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
    });
    return product;
  });

  return res.status(200).json( updatedProducts );
}

const updateProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { _id = '', images = [] } = req.body as IProduct;

  if ( !isValidObjectId( _id ) ) {
    return res.status(400).json({ message: 'El ID del producto no es válido' });
  }
  
  if ( images.length < 2 ) {
    return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
  }

  // TODO: posiblemente tendremos un localhost:3000/products/1234jhh.jpg

  try {
    await db.connect();
    const product = await Product.findById(_id);
    
    if ( !product ) {
      await db.disconnect();
      return res.status(400).json({ message: 'No existe un producto con ese ID' });
    }

    // TODO: eliminar imagenes en cloudinary
    // https://res.cloudinary.com/dy7pj83ot/image/upload/v1658443610/glhfmao8z1fchbo6izk9.jpg"
    product.images.forEach( async(image) => {
      if ( !images.includes(image) ) {
        // Borrar de cloudinary
        const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.');
        // console.log({ image, fileId, extension });
        await cloudinary.uploader.destroy( fileId );
        
      }
    });

    await product.updateOne( req.body );
    await db.disconnect();

    return res.status(200).json( product );

  } catch (error) {
    console.log(error);
    await db.disconnect();

    return res.status(400).json({ message: 'Revisar logs del servidor' });    
  }

}
const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const { images = [] } = req.body as IProduct;

  if ( images.length < 2 ) {
    return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes' });
  }
  
  // TODO: posiblemente tendremos un localhost:3000/products/1234jhh.jpg
  
  try {
    await db.connect();
    // valida si ya existe un producto en ese slug
    const productInDB = await Product.findOne({ slug: req.body.slug });

    if ( productInDB ) {
      await db.disconnect();
      return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
    }

    const product = new Product( req.body );
    await product.save();
    await db.disconnect();

    // status 201 - elemento creado con éxito
    return res.status(201).json( product );

  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(400).json({ message: 'Revisar logs del servidor' });
  }

}

