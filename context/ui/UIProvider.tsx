import { FC, useReducer } from 'react';
import { uiState } from '../../interfaces';
import { UIContext, uiReducer } from './';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const UI_INITIAL_STATE: uiState = {
  isMenuOpen: false,
}

export const UIProvider: FC<Props> = ({children}) => {

  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: '[UI] - ToggleMenu' });
  }

  return (
    <UIContext.Provider value={{
      ...state,

      // Methods
      toggleSideMenu,
  }}>
    {children}
    </UIContext.Provider>
  )
}