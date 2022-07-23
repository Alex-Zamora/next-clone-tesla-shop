import { uiState } from '../../interfaces';

type uiActionType =
  | { type: '[UI] - ToggleMenu' }

export const uiReducer = ( state: uiState, action: uiActionType ): uiState => {
  switch (action.type) {
    case '[UI] - ToggleMenu':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      }
    default:
      return state;
  }
}

