import { TOGGLE_NAVIGATION_MENU } from 'actions';

export function navigation(
  state: any = { open: false },
  action: {
    type: string;
    open: boolean;
  }
) {
  switch (action.type) {
    case TOGGLE_NAVIGATION_MENU:
      return {
        ...state,
        open: action.open
      };
    default:
      return state;
  }
}
