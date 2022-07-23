import { CartState } from './';
import { ICartProduct } from '../../interfaces/cart';
import { IShippingAddress } from '../../interfaces';

type CartActionType =
| { type: '[Cart] - Load from cookies | storage', payload: ICartProduct[] }
| { type: '[Cart] - Update', payload: ICartProduct[] }
| { type: '[Cart] - Change quantity', payload: ICartProduct }
| { type: '[Cart] - Remove', payload: ICartProduct }
| { type: '[Cart] - LoadAddress from Cookies', payload: IShippingAddress }
| { type: '[Cart] - UpdateShippingAddress', payload: IShippingAddress }
| { type: '[Cart] - Order Complete' }
| { type: '[Cart] - Update order summary',
  payload: {
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
  }
}

export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {
  switch(action.type) {
    case '[Cart] - Load from cookies | storage':
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload]
      }
    case '[Cart] - Update':
      return {
        ...state,
        cart: [...action.payload]
      }
    case '[Cart] - Change quantity':
      return {
        ...state,
        cart: state.cart.map(product => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;

          // product.quantity = action.payload.quantity;
          // return product;
          return action.payload;

        })
      }
    case '[Cart] - Remove':
      return {
        ...state,
        cart: state.cart.filter(({ _id, size }) => !(_id === action.payload._id && size === action.payload.size))

        // El filter mantiene los items cuando la condición regresa un true
        // cart: state.cart.filter(product => {
        //   // cuando se cumpla esta condición regreso false para que no mantenga este producto
        //   if ( product._id === action.payload._id && product.size === action.payload.size ) {
        //     return false;
        //   }
        //   return true;
        // })
      }
    case '[Cart] - Update order summary':
      return {
        ...state,
        ...action.payload
      }
    case '[Cart] - UpdateShippingAddress':
    case '[Cart] - LoadAddress from Cookies':
      return {
        ...state,
        shippingAddress: action.payload
      }
    case '[Cart] - Order Complete':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0 
      }

    default:
      return state;
  }
}