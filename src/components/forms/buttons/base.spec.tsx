import * as React from 'react';
import { BaseButton } from './base';
import { render } from 'react-testing-library';

describe('BaseButtom', () => {
  it('should be defined', () => {
    expect(BaseButton).toBeDefined();
  });
  it('should render', () => {
    const cmp = render(<BaseButton>Base Button</BaseButton>);
    expect(cmp).toBeDefined();
    expect(cmp.getByTestId('Button').textContent).toBe('Base Button');
  });
});
