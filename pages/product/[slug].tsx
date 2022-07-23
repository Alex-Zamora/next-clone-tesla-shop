import { useState, useContext } from 'react';
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from 'next/router';
import { Box, Button, Chip, Grid, Typography } from "@mui/material";

import { ShopLayout } from "../../components/layouts";
import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";

import { useProducts } from "../../hooks";
import { ICartProduct, IProduct, ISize } from "../../interfaces";

import { initialData } from "../../database/seed-data";
import { dbProducts } from "../../database";
import { CartContext } from '../../context';

interface Props {
  product: IProduct
}

// const product = initialData.products[0];

const ProductPage: NextPage<Props> = ({ product }) => {

  // const { products: product, isLoading } = useProducts(`${ router.query.slug }`);
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });
  const { addProductToCart, cart } = useContext(CartContext);

  const router = useRouter();

  const onSelectedSize = (size: ISize) => {
    setTempCartProduct({
      ...tempCartProduct,
      size
    })
  }

  const updateQuantity = (quantity: number) => {
    setTempCartProduct({
      ...tempCartProduct,
      quantity
    })
  }

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;
    addProductToCart(tempCartProduct);
    router.push('/cart');
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            {/* titles */}
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>

            {/* quantity */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updateQuantity={updateQuantity}
                maxValue={product.inStock}
              />

              <SizeSelector
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                onSelectedSize={onSelectedSize}
              />
            </Box>

            { product.inStock > 0
                ? (
                  <Button
                    color="secondary"
                    className="circular-btn"
                    onClick={ onAddProduct }
                  >
                    {
                      tempCartProduct.size
                        ? 'Agregar al carrito'
                        : 'Seleccione una talla'
                    }
                  </Button>
                ) 
                : <Chip label="No hay disponibles" color="error" variant="outlined" />
            }

            {/* description */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// NO USAR SERVER SIDE RENDER EN EL PDP
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//   const { slug } = params  as { slug: string };

//   const product = await dbProducts.getProductBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       product
//     },
//   }
// }

// GET STATIC PATHS
export const getStaticPaths: GetStaticPaths = async () => {
  const products = await dbProducts.getAllProductSlugs();

  const paths = products.map(({ slug }) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: "blocking"
  }
}

// GET STATIC PROPS
export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug } = params  as { slug: string };

  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        // el redirect no es permanente por que puede que exista un pokemon el id solicitado
        permanent: false
      }
    }
  }

  product.images = product.images.map(image => {
    return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
  });

  return {
    props: {
      product
    },
    revalidate: 86400 // cada 24hrs
  }
}

export default ProductPage;
