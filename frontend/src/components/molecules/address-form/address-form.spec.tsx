import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressForm from './';

const mockTranslations: { [key: string]: string } = {
  cancel: 'Cancel',
  submit: 'Save',
  'common.company.name': 'Company Name',
  'common.care.of': 'Care Of',
  'common.phone': 'Phone',
  'common.optional.for.order.updates': 'Optional for order updates',
  'common.country': 'Country',
  'common.address': 'Address',
  'dashboard.add.another.address': 'Add another address',
  'common.zipCode': 'Zip Code',
  'common.city': 'City',
  'common.state': 'State',
  'dashboard.save.as.default': 'Save as default',
  'common.address.shipping': 'Default Shipping Address',
  'common.address.billing': 'Default Billing Address',
};

jest.mock('@/providers/I18n/hooks/useTranslation', () => () => ({
  translate: (key: string) => mockTranslations[key] || key,
}));

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
    expect(screen.getByLabelText('Care Of', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Phone', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Country', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Zip Code', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('City', { exact: false })).toBeInTheDocument();
  });

  it('displays a second address line when the "Add another address" link is clicked', async () => {
    render(<AddressForm onAddAddress={jest.fn()} onUpdateAddress={jest.fn()} addresses={[]} countryOptions={[]} />);

    expect(screen.queryByLabelText(/Address 2/i)).not.toBeInTheDocument();

    const addAnotherAddressLink = screen.getByText(/Add another address/i);
    await userEvent.click(addAnotherAddressLink);

    expect(screen.getByLabelText(/Address 2/i)).toBeInTheDocument();
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

    await userEvent.type(screen.getByLabelText(/Company Name/), 'Test Company');
    await userEvent.type(screen.getByRole('textbox', { name: /line1/ }), '123 Main St');
    await userEvent.type(screen.getByLabelText(/Zip Code/), '12345');
    await userEvent.type(screen.getByLabelText(/City/), 'Test City');

    await userEvent.click(screen.getByPlaceholderText('common.select'));
    await userEvent.click(screen.getByText('USA')); // Click the desired option

    const saveButton = screen.getByRole('button', { name: /Save/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(onAddAddress).toHaveBeenCalledWith({
        name: 'Test Company',
        line1: '123 Main St',
        zip: '12345',
        city: 'Test City',
        country: 'US',
      });
    });
  });

  it('displays a validation error if required fields are missing', async () => {
    render(<AddressForm onAddAddress={jest.fn()} onUpdateAddress={jest.fn()} addresses={[]} countryOptions={[]} />);

    const saveButton = screen.getByText('common.save');
    await userEvent.click(saveButton);

    expect(screen.getByLabelText(/Company Name/)).toHaveAttribute('required');
    expect(screen.getByRole('textbox', { name: /line1/ })).toHaveAttribute('required');
    expect(screen.getByLabelText(/Zip Code/)).toHaveAttribute('required');
    expect(screen.getByLabelText(/City/)).toHaveAttribute('required');
  });
});
