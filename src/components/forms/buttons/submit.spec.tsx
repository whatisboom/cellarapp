import * as React from 'react';
import { SubmitButton } from './submit';
import { render } from 'react-testing-library';

describe('BaseButtom', () => {
  it('should be defined', () => {
    expect(SubmitButton).toBeDefined();
  });
  it('should render', () => {
    const cmp = render(<SubmitButton />);
    expect(cmp).toBeDefined();
    expect(cmp.getByTestId('Button').textContent).toBe('Submit');
  });
});
