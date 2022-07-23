import { AuthState } from './';
import { IUser } from '../../interfaces';

type AuthActionType =
  | { type: '[Auth] - Login', payload: IUser}
  | { type: '[Auth] - Logut' }


export const authReducer = ( state: AuthState, action: AuthActionType ): AuthState => {
  switch (action.type) {
    case '[Auth] - Login':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload
      }
    case '[Auth] - Logut':
      return {
        ...state,
        isLoggedIn: false,
        user: undefined
      }
      
    default:
      return state;
  }
}