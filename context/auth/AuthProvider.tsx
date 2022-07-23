import { FC, useReducer, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

import Cookies from 'js-cookie';
import axios from 'axios';

import { AuthContext, authReducer } from './';
import { teslaApi } from '../../api';
import { IUser } from '../../interfaces';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
}

export const AuthProvider: FC<Props> = ({children}) => {

  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const router = useRouter();

  const { data, status } = useSession();

  useEffect(() => {
    if ( status === 'authenticated' ) {
      dispatch({ type: '[Auth] - Login', payload: data.user as IUser })
    }
  }, [status, data]);
  

  // autenticación personalizada
  // useEffect(() => {
  //   checkToken();
  // }, []);

  const checkToken = async() => {
    if ( !Cookies.get('token') ) return;
    try {
      const { data } = await teslaApi.get('/user/validate-token');
      const { token, user } = data;
      dispatch({ type: '[Auth] - Login', payload: user });
    } catch (error) {
      Cookies.remove('token');
    }
  }

  const loginUser = async( email: string, password: string ): Promise<boolean> => {
    // Falto ponerle el tipo de la respuesta
    // Ejemplo: teslaApi.post<IUser>()
    try {
      const { data } = await teslaApi.post('/user/login', { email, password });
      const { token, user } = data;
      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  }

  const registerUser = async( name: string, email: string, password: string ): Promise<{hasError: boolean; message?: string}> => {
    try {
      const { data } = await teslaApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      Cookies.set('token', token );
      dispatch({ type: '[Auth] - Login', payload: user });
      return {
        hasError: false
      }
    } catch (error) {
      console.log("error ", error);
      if ( axios.isAxiosError(error) ) {
        return {
          hasError: true,
          message: ''
          // message: error.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'No se pudo crear el usuario - intente de nuevo'
      }
    }
  }

  const logout = () => {
    // Cookies.remove('token');
    
    // es opcional borrar el carrito
    Cookies.remove('cart');

    Cookies.remove('lastname');
    Cookies.remove('firstName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');

    signOut();

    // en lugar de hacer full refresh se puede mandar a llamar un dispatch para cambiar el state del login y user
    // router.reload();
  }

  return (
    <AuthContext.Provider value={{
      ...state,

      // Methods
      loginUser,
      registerUser,
      logout,
  }}>
    {children}
    </AuthContext.Provider>
  )
}