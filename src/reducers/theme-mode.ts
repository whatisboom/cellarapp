import { SWITCH_THEME_MODE } from 'actions';

export function themeMode(state: any = null, action: any) {
  switch (action.type) {
    case SWITCH_THEME_MODE:
      return state === 'dark' ? 'light' : 'dark';
    default:
      return state;
  }
}
