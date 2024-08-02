import React from 'react';
import { render } from '@testing-library/react';
import Label from './index';

describe('Label Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Label>Test Label</Label>);
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('renders optional label when showOptionalLabel is true', () => {
    const { getByText } = render(<Label showOptionalLabel>Test Label</Label>);
    expect(getByText('(common.optional)')).toBeInTheDocument();
  });

  it('renders custom optional label when provided', () => {
    const { getByText } = render(
      <Label showOptionalLabel optionalLabel="Optional">
        Test Label
      </Label>,
    );
    expect(getByText('(Optional)')).toBeInTheDocument();
  });

  it('renders asterisk when required and requiredStyle is asterisk', () => {
    const { getByText } = render(
      <Label required requiredStyle="asterisk">
        Test Label
      </Label>,
    );
    expect(getByText('*')).toBeInTheDocument();
  });

  it('renders required label when required and requiredStyle is label', () => {
    const { getByText } = render(
      <Label required requiredStyle="label">
        Test Label
      </Label>,
    );
    expect(getByText('common.field.required')).toBeInTheDocument();
  });

  it('does not render when children and required are both false', () => {
    const { container } = render(<Label />);
    expect(container.firstChild).toBeNull();
  });
});
