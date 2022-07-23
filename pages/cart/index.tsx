import { useContext, useEffect } from 'react';
import Link from 'next/link';

import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";

import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from '../../context';
import { useRouter } from 'next/router';

const CartPage = () => {
  
  const { isLoaded, cart } = useContext( CartContext );
  const router = useRouter();

  useEffect(() => {
    if ( isLoaded && cart.length === 0 ) {
      // remplazar la historia
      router.replace('/cart/empty');
    }
  }, [ isLoaded, cart, router ]);

  // evitar mostrar la pantalla de carrito, mientras se evalua si el cart tiene productos
  if ( cart.length === 0 ) return (<></>);

  return (
    <ShopLayout title="Carrito - 3" pageDescription="Carrito de compras de la tienda">
      <Typography variant="h1" component="h1">Carrito</Typography>
      <Grid container >
        <Grid item xs={ 12 } sm={ 7 }>
          <CartList editable />
        </Grid>

        <Grid item xs={ 12 } sm={ 5 }>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Orden</Typography>
              
              <Divider sx={{ my: 1 }} />

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Link href="/checkout/address">
                  <Button
                    color="secondary"
                    className="circular-btn"
                    fullWidth

                  >
                    Checkout
                  </Button>
                </Link>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default CartPage;