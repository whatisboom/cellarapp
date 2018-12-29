import { SWITCH_THEME_MODE } from 'actions';

export function darkMode(state: any = null, action: any) {
  switch (action.type) {
    case SWITCH_THEME_MODE:
      return !state;
    default:
      return state;
  }
}
