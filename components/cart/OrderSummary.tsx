import { Grid, Typography } from "@mui/material"
import { FC, useContext } from 'react';
import { CartContext } from "../../context";
import { currency } from "../../utils";

interface Props {
  orderValues?: {
    subTotal: number;
    total: number;
    tax: number;
    numberOfItems: number;
  }
}

export const OrderSummary:FC<Props> = ({ orderValues }) => {

  const { subTotal, tax, total,numberOfItems,  } = useContext(CartContext);

  const summaryValues = orderValues ? orderValues : { subTotal, tax, total,numberOfItems };

  return (
    <Grid container sx={{ pt: 2 }}>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>

      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{ summaryValues.numberOfItems } { summaryValues.numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>

      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{ currency.format(summaryValues.subTotal) }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</Typography>
      </Grid>

      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{ currency.format(summaryValues.tax) }</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt:2 }}>
        <Typography variant="subtitle1">Total</Typography>
      </Grid>

      <Grid item xs={6} display="flex" justifyContent="end" sx={{ mt:2 }}>
        <Typography variant="subtitle1">{ currency.format(summaryValues.total) }</Typography>
      </Grid>
    </Grid>
  )
}
