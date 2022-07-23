import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"

import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'

import { countries,} from '../../utils'
import { ShopLayout } from "../../components/layouts"
import { CartContext } from '../../context'

type FormData = {
  firstName: string;
  lastname: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

const getAddressFromCookies = ():FormData => {
  return {
    firstName: Cookies.get('firstName') || '',
    lastname: Cookies.get('lastname') || '',
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    zip: Cookies.get('zip') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    phone: Cookies.get('phone') || '',
  }
}

const AddressPage = () => {

  const router = useRouter();
  const { updateAddress } = useContext(CartContext);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastname: '',
      address: '',
      address2: '',
      zip: '',
      city: '',
      country: countries[0].code,
      phone: '',
    }
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    reset(getAddressFromCookies());
  }, [])
  

  const onSubmit = async (data: FormData) => {
    updateAddress( data );
    router.push('/checkout/summary');
  }

  return (
    <form onSubmit={handleSubmit( onSubmit )}>
      <ShopLayout title="Agregar dirección" pageDescription="Agrega la dirección">
        <Typography variant="h1" component="h1">Dirección</Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="nombre"
              variant="filled"
              fullWidth
              { ...register('firstName', {
                required: 'Este campo es requerido'
              })}
              error={ !!errors.firstName }
              helperText={ errors.firstName?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              { ...register('lastname', {
                required: 'Este campo es requerido'
              })}
              error={ !!errors.lastname }
              helperText={ errors.lastname?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              { ...register('address', {
                required: 'Este campo es requerido'
              })}
              error={ !!errors.address }
              helperText={ errors.address?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2"
              variant="filled"
              fullWidth
              { ...register('address2')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Código Postal"
              variant="filled"
              fullWidth
              { ...register('zip', {
                required: 'Este campo es requerido'
              })}
              error={ !!errors.zip }
              helperText={ errors.zip?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            {/* <FormControl fullWidth> */}
              <TextField
                // select
                variant="filled"
                label="País"
                fullWidth
                defaultValue={ Cookies.get('country') || countries[0].code }
                // value={'MEX'}
                { ...register('country', {
                  required: 'Este campo es requerido'
                })}
                error={ !!errors.country }
                helperText={ errors.country?.message }
              >
                {/* { countries.map( country => (
                  <MenuItem key={country.code} value={country.code}>
                    { country.name }
                  </MenuItem>
                ))} */}
              </TextField>
            {/* </FormControl> */}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              { ...register('city', {
                required: 'Este campo es requerido'
              })}
              error={ !!errors.city }
              helperText={ errors.city?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              { ...register('phone', {
                required: 'Este campo es requerido'
              })}
              error={ !!errors.phone }
              helperText={ errors.phone?.message }
            />
          </Grid>

        </Grid>

        <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
          <Button
            color="secondary"
            className="circular-btn"
            size="large"
            type="submit"
          >
            Revisar pedido
          </Button>
        </Box>

      </ShopLayout>
    </form>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  
//   const { token = '' } = req.cookies;
//   let isValidToken = false;

//   try {
//     await jwt.isValidToken( token );
//     isValidToken = true;
//   } catch (error) {
//     isValidToken = false;
//   }

//   if ( !isValidToken ) {
//     return {
//       redirect: {
//         destination: '/auth/login?p=/checkout/address',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
      
//     }
//   }
// }

export default AddressPage;