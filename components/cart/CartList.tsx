import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
// import { initialData } from "../../database/seed-data";
import { ItemCounter } from '../ui';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { ICartProduct } from '../../interfaces/cart';
import { IOrderItem } from '../../interfaces';

// const productsInCart = [
//   initialData.products[0],
//   initialData.products[2],
//   initialData.products[3],
// ];

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList:FC<Props> = ({ editable = false, products = [] }) => {

  const { cart, updateCartQuanty, removeCartProduct } = useContext(CartContext);

  const onNewCartQuantityValue = (product: ICartProduct , newQuantityValue: number) => {
    product.quantity = newQuantityValue;
    updateCartQuanty( product );
  }

  const onRemoveProduct = (product: ICartProduct ) => {
    removeCartProduct(product);
  }

  const productsToShow = products.length > 0 ? products : cart;

  return <>{productsToShow.map((product) => (
    <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
      <Grid item xs={3}>
        <NextLink href={`/product/${product.slug}`}>
          <Link>
            <CardActionArea>
              <CardMedia
                image={ product.image }
                component='img'
                sx={{ borderRadius: '5px' }}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Grid>
      <Grid item xs={7}>
        <Box display="flex" flexDirection="column">
          <Typography variant="body1">{ product.title }</Typography>
          <Typography variant="body1">Talla: <strong>{ product.size }</strong></Typography>

          {editable 
            ? <ItemCounter
                currentValue={product.quantity} 
                maxValue={10}
                updateQuantity={(value) => onNewCartQuantityValue(product as ICartProduct, value)}            
              />
            : (
              <Typography variant="h6">{ product.quantity } { product.quantity > 1 ? 'productos' : 'producto' }</Typography>
            )
          }

        </Box>
      </Grid>
      <Grid item xs={2} display="flex" alignItems="center" flexDirection="column">
        <Typography variant="subtitle1">${ product.price }</Typography>
        { editable &&
          <Button 
            variant="text" 
            color="secondary" 
            onClick={() => onRemoveProduct( product as ICartProduct )}
          >
            Remover
          </Button> 
        }
      </Grid>
    </Grid>
  ))}</>;
};
