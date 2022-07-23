import { GetServerSideProps, NextPage } from 'next'

import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrderSummary } from "../../../components/cart";
import { AdminLayout } from "../../../components/layouts";
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

  const { shippingAddress, subTotal, total, tax, numberOfItems } = order;

  const orderValues = {
    subTotal,
    total,
    tax,
    numberOfItems
  }

  return (
    <AdminLayout title="Resumen de la orden" subtitle="">
      <Typography variant="h1" component="h1">Orden: { order._id }</Typography>

      { order.isPaid
        ? (
          <Chip 
            sx={{ my: 2 }}
            label="Orden pagada"
            variant="outlined"
            color="success"
            icon={ <CreditScoreOutlined/> }
          />
        ) : (
          <Chip 
            sx={{ my: 2 }}
            label="Pendiente de pago"
            variant="outlined"
            color="error"
            icon={ <CreditCardOffOutlined/> }
          />
        )
      }      

      <Grid container className="fadeIn">
        <Grid item xs={ 12 } sm={ 7 }>
          <CartList products={ order.orderItems } />
        </Grid>

        <Grid item xs={ 12 } sm={ 5 }>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen ({ order.numberOfItems }) { order.numberOfItems > 1 ? 'productos' : 'producto' } </Typography>
              
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección de entrega</Typography>
              </Box>

              
              <Typography>{ shippingAddress.firstName } { shippingAddress.firstName }</Typography>
              <Typography>{ shippingAddress.address } { shippingAddress.address2 ? `, ${ shippingAddress.address2 }` : '' }</Typography>
              <Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
              <Typography>{ shippingAddress.country }</Typography>
              <Typography>{ shippingAddress.phone }</Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <OrderSummary
                orderValues={orderValues}
              />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column" >
                
                <Box
                  display="flex"
                  flexDirection="column"
                >
                  { order.isPaid
                    ? (
                      <Chip 
                        sx={{ my: 2 }}
                        label="Orden pagada"
                        variant="outlined"
                        color="success"
                        icon={<CreditScoreOutlined />}
                      />
                    ) : (
                      <Chip 
                        sx={{ my: 2 }}
                        label="Pendiente de pago"
                        variant="outlined"
                        color="error"
                        icon={ <CreditCardOffOutlined/> }
                      />
                    )
                  }
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const { id = '' } = query;
  const order = await dbOrders.getOrderById( id.toString() );

  if ( !order ) {
    return {
      redirect: {
        destination: `/admin/orders`,
        permanent: false
      }
    }
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage;