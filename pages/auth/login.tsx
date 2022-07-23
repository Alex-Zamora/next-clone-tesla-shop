import { useContext, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next'
import { getSession, signIn, getProviders } from 'next-auth/react';
import NextLink from 'next/link';

import { Box, Button, Chip, Grid, Link, TextField, Typography, Divider } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthContext } from '../../context';
import { AuthLayout } from "../../components/layouts";
import { validations } from '../../utils';
import { teslaApi } from '../../api';
import { useRouter } from 'next/router';

type FormData = {
  email: string,
  password: string,
};

const LoginPage = () => {

  const router = useRouter();
  // const { loginUser } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);

  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then( prov => {
      // provedores ej. github, google, etc.
      setProviders(prov);
    });
  }, [])
  

  const onLoginUser = async ( { email, password }: FormData ) => {

    setShowError(false);

    await signIn('credentials', { email, password });

    // const isValidLogin = await loginUser(email, password);
    
    // if (!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => setShowError(false), 3000);
    //   return;
    // }

    // replace para que el usuario no pueda regresar a la página de login - se remplaza en el historial de navegación
    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination);

    // try {
    //   const { data } = await teslaApi.post('/user/login', { email, password });
    //   const { token, user } = data;
    //   console.log({ token, user });
    // } catch (error) {
    //   console.log('error ', error);
    //   setShowError(true);

    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);

    //   // if ( axios.isAxiosError(error) {
    //   // })
    // }
  }

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={ handleSubmit(onLoginUser) } noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">Iniciar Sesión</Typography>
              <Chip
                label="No reconocemos ese usuario / contraseña"
                color="error"
                icon={ <ErrorOutline /> }
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                { ...register('email', {
                    required: 'Este campo es requerido',
                    validate: validations.isEmail
                })}
                error={ !!errors.email }
                helperText={ errors.email?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                { ...register('password', {
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                })}
                error={ !!errors.password }
                helperText={ errors.password?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" color="secondary" className="circular-btn" size="large" fullWidth>
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink href={ router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register' } passHref>
                <Link underline="always">
                  ¿No tienes cuenta?
                </Link>
              </NextLink>
            </Grid>

            <Grid item xs={12} display="flex" flexDirection={'column'} justifyContent="end">
              <Divider sx={{ width: '100%', mb: 2 }}  />
              { Object.values( providers ).map(( provider: any ) => {
                  if ( provider.id === 'credentials' ) return ( <div key="credentials"></div> )
                  return (
                    <Button
                      key={provider.id}
                      variant="outlined"
                      fullWidth
                      color="primary"
                      sx={{ mb: 1 }}
                      onClick={ () => signIn( provider.id )}
                    >
                      { provider.name }
                    </Button>
                  )
                })
              }
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  
  const session = await getSession({ req });

  // si no viene queryparam p, que sea '/'
  const { p = '/' } = query;

  if ( session ) {
    return {
      redirect: {
        destination: p .toString(),
        permanent: false,
      }
    }
  }

  return {
    props: { }
  }
}

export default LoginPage;