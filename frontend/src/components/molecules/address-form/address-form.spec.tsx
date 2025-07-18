import React from 'react';
import { render, screen, waitFor } from '@test/utils';
import userEvent from '@testing-library/user-event';
import AddressForm from './';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ back: jest.fn() })),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

describe('AddressForm', () => {
  it('renders the form fields correctly', () => {
    render(
      <AddressForm
        onAddAddress={jest.fn()}
        onUpdateAddress={jest.fn()}
        addresses={[]}
        countryOptions={[{ name: 'USA', value: 'US', states: [] }]}
      />,
    );

    expect(screen.getByLabelText('Company Name', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('C/O', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Phone', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Country', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Street number')).toBeInTheDocument();
    expect(screen.getByText('Street name')).toBeInTheDocument();
    expect(screen.getByText('Building/Business')).toBeInTheDocument();
    expect(screen.getByLabelText('Postcode', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('City', { exact: false })).toBeInTheDocument();
  });

  it('calls onAddAddress when form is submitted for a new address', async () => {
    const onAddAddress = jest.fn();
    render(
      <AddressForm
        onAddAddress={onAddAddress}
        onUpdateAddress={jest.fn()}
        addresses={[]}
        countryOptions={[{ name: 'USA', value: 'US', states: [] }]}
      />,
    );

    await userEvent.type(screen.getByLabelText(/Company name/), 'Test Company');
    await userEvent.type(screen.getByRole('textbox', { name: /streetName/ }), 'Main St');
    await userEvent.type(screen.getByRole('textbox', { name: /streetNumber/ }), '123');
    await userEvent.type(screen.getByLabelText(/Postcode/), '12345');
    await userEvent.type(screen.getByLabelText(/City/), 'Test City');

    await userEvent.click(screen.getByPlaceholderText('Select'));
    await userEvent.click(screen.getByText('USA')); // Click the desired option

    const saveButton = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(onAddAddress).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Company',
          streetName: 'Main St',
          streetNumber: '123',
          zip: '12345',
          city: 'Test City',
          country: 'US',
        }),
      );
    });
  });

  it('displays a validation error if required fields are missing', async () => {
    render(<AddressForm onAddAddress={jest.fn()} onUpdateAddress={jest.fn()} addresses={[]} countryOptions={[]} />);

    const saveButton = screen.getByRole('button', { name: /Save address/i });
    await userEvent.click(saveButton);

    expect(screen.getByLabelText(/Company name/)).toHaveAttribute('required');
    expect(screen.getByRole('textbox', { name: /streetName/ })).toHaveAttribute('required');
    expect(screen.getByLabelText(/Postcode/)).toHaveAttribute('required');
    expect(screen.getByLabelText(/City/)).toHaveAttribute('required');
  });
});
