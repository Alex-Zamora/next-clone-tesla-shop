import { FC, useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';
import { ICartProduct, IOrder, IShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import { teslaApi } from '../../api';
import axios from 'axios';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: IShippingAddress
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,

  shippingAddress: undefined
}

export const CartProvider: FC<Props> = ({children}) => {

  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    if ( Cookies.get('firstName') ) {
      const shippingAddress = {
        firstName: Cookies.get('firstName') || '',
        lastname: Cookies.get('lastname') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
      }
      dispatch({ type: '[Cart] - LoadAddress from Cookies', payload: shippingAddress })
    }
  }, [])
  

  useEffect(() => {
    try {
      const cookiesCart = Cookies.get('cart') ? JSON.parse(Cookies.get('cart')!) : [];
      dispatch({ type: '[Cart] - Load from cookies | storage', payload: cookiesCart });
    } catch (error) {
      dispatch({ type: '[Cart] - Load from cookies | storage', payload: [] });
    }
  }, []);

  useEffect(() => {
    if (state.cart.length > 0) Cookies.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);
  
  useEffect(() => {

    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
    const subTotal = state.cart.reduce((prev, current) => current.quantity * current.price + prev, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    
    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * ( taxRate + 1 )
    }
    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    //!Solución 1
    const productInCart = state.cart.some(p => p._id === product._id);
    if (!productInCart) return dispatch({ type: '[Cart] - Update', payload: [...state.cart, product] });

    const ProductInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size);
    if (!ProductInCartButDifferentSize) return dispatch({ type: '[Cart] - Update', payload: [...state.cart, product] });

    const updateProduct = state.cart.map(p => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      p.quantity += product.quantity;
      return p;
    });
    dispatch({ type: '[Cart] - Update', payload: updateProduct });

    //!Solución 2
    // let cartProductUpdated = [...state.cart];

    // const indexWithSameSizeID = state.cart.findIndex(
    //   ({ _id, size }) => _id === product._id && size === product.size
    // );

    // const isThereProductWithSameSizeID = indexWithSameSizeID >= 0;

    // if (isThereProductWithSameSizeID) {
    //   cartProductUpdated[indexWithSameSizeID].quantity += product.quantity;
    // } else {
    //   cartProductUpdated = [...cartProductUpdated, product];
    // }
    // dispatch({ type: '[Cart] - Update', payload: cartProductUpdated });
  }

  const updateCartQuanty = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change quantity', payload: product });
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove', payload: product });
  }

  const updateAddress = ( address: IShippingAddress ) => {
    Cookies.set('firstName', address.firstName);
    Cookies.set('lastname', address.lastname);
    Cookies.set('address', address.address);
    Cookies.set('address2', address.address2 || '');
    Cookies.set('zip', address.zip);
    Cookies.set('city', address.city);
    Cookies.set('country', address.country);
    Cookies.set('phone', address.phone);
    
    dispatch({ type: '[Cart] - UpdateShippingAddress', payload: address });
  }

  const createOrder = async():Promise<{ hasError: boolean; message: string; }> => {

    if (!state.shippingAddress ) {
      throw new Error('No hay dirección de entrega');
    }

    const body: IOrder = {
      // orderItems: state.cart.map( product => () ),
      orderItems: state.cart.map( p => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false
    }

    try {
      const { data } = await teslaApi.post<IOrder>('/orders', body);

      // limpiar carrito y totales
      dispatch({ type: '[Cart] - Order Complete' });

      return {
        hasError: false,
        message: data._id!
      }

    } catch (error) {
      console.log(error);
      if ( axios.isAxiosError(error) ) {
        return {
          hasError: true,
          message: 'Error en el backend'
          // message: error.response?.data.message
        }
      }
      return {
        hasError: true,
        message: 'Error no controlado, revise los logs'
      }
    }
  }

  return (
    <CartContext.Provider value={{
      ...state,

      // Methods
      addProductToCart,
      updateCartQuanty,
      removeCartProduct,
      updateAddress,
      createOrder,
  }}>
    {children}
    </CartContext.Provider>
  )
}