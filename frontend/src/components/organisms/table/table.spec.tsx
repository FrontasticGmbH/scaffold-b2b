import I18nProvider from '@/providers/I18n';
import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Table from '.';

describe('[Component] Table', () => {
  it('Renders table container correctly', () => {
    render(<Table.Container />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('Renders table head correctly', () => {
    const { baseElement } = render(
      <Table.Container>
        <Table.Head>
          <Table.Row>
            <Table.Cell>H1</Table.Cell>
            <Table.Cell>H2</Table.Cell>
            <Table.Cell>H3</Table.Cell>
          </Table.Row>
        </Table.Head>
      </Table.Container>,
    );

    expect(baseElement.querySelector('thead > tr')).toBeInTheDocument();
    expect(baseElement.querySelector('thead > tr')?.childNodes.length).toBe(3);

    expect(baseElement.querySelector('thead > tr')?.childNodes[0]?.textContent).toBe('H1');
    expect(baseElement.querySelector('thead > tr')?.childNodes[1]?.textContent).toBe('H2');
    expect(baseElement.querySelector('thead > tr')?.childNodes[2]?.textContent).toBe('H3');
  });

  it('Renders table body correctly', () => {
    const { baseElement } = render(
      <Table.Container>
        <Table.Body>
          <Table.Row>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>2</Table.Cell>
            <Table.Cell>3</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>4</Table.Cell>
            <Table.Cell>5</Table.Cell>
            <Table.Cell>6</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Container>,
    );

    expect(baseElement.querySelector('tbody')).toBeInTheDocument();
    expect(baseElement.querySelector('tbody')?.childNodes.length).toBe(2);

    expect(baseElement.querySelector('tbody')?.childNodes[0]?.childNodes.length).toBe(3);
    expect(baseElement.querySelector('tbody')?.childNodes[0]?.childNodes[0]?.textContent).toBe('1');
    expect(baseElement.querySelector('tbody')?.childNodes[0]?.childNodes[1]?.textContent).toBe('2');
    expect(baseElement.querySelector('tbody')?.childNodes[0]?.childNodes[2]?.textContent).toBe('3');

    expect(baseElement.querySelector('tbody')?.childNodes[1]?.childNodes.length).toBe(3);
    expect(baseElement.querySelector('tbody')?.childNodes[1]?.childNodes[0]?.textContent).toBe('4');
    expect(baseElement.querySelector('tbody')?.childNodes[1]?.childNodes[1]?.textContent).toBe('5');
    expect(baseElement.querySelector('tbody')?.childNodes[1]?.childNodes[2]?.textContent).toBe('6');
  });

  it('Renders sortale table cell correctly', () => {
    const { baseElement } = render(
      <Table.Container>
        <Table.Body>
          <Table.Row>
            <Table.Cell sortable />
          </Table.Row>
        </Table.Body>
      </Table.Container>,
    );

    expect(baseElement.querySelector('svg')).toBeInTheDocument();
  });

  it('Renders pagination numbers correctly', () => {
    const { rerender } = render(<Table.Pagination page={1} limit={25} totalItems={100} />, {
      wrapper: ({ children }) => (
        <I18nProvider translations={{ en: { common: { 'from.to': `{from} - {to} /  {totalItems}` } } }}>
          {children}
        </I18nProvider>
      ),
    });

    expect(screen.getByText('1 - 25 / 100')).toBeDefined();

    rerender(<Table.Pagination page={2} limit={25} totalItems={200} />);

    expect(screen.getByText('26 - 50 / 200')).toBeDefined();
  });

  it('Disables next and previous buttons correctly', () => {
    const { rerender } = render(<Table.Pagination page={1} limit={25} totalItems={100} />);

    expect(screen.getByTestId('previous-arrow')).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByTestId('next-arrow')).toHaveAttribute('data-disabled', 'false');

    rerender(<Table.Pagination page={4} limit={25} totalItems={100} />);

    expect(screen.getByTestId('previous-arrow')).toHaveAttribute('data-disabled', 'false');
    expect(screen.getByTestId('next-arrow')).toHaveAttribute('data-disabled', 'true');
  });

  it('Handles all of the events correctly', async () => {
    const onRowsPerPageChange = jest.fn();
    const onPrevious = jest.fn();
    const onNext = jest.fn();

    const { rerender } = render(
      <Table.Pagination
        page={1}
        limit={25}
        totalItems={100}
        onRowsPerPageChange={onRowsPerPageChange}
        onPrevious={onPrevious}
        onNext={onNext}
      />,
    );

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('50')));

    expect(onRowsPerPageChange).toHaveBeenCalledWith('50');

    await act(async () => userEvent.click(screen.getByTestId('next-arrow')));

    expect(onNext).toHaveBeenCalled();

    rerender(
      <Table.Pagination
        page={2}
        limit={25}
        totalItems={100}
        onRowsPerPageChange={onRowsPerPageChange}
        onPrevious={onPrevious}
        onNext={onNext}
      />,
    );

    await act(async () => userEvent.click(screen.getByTestId('previous-arrow')));

    expect(onPrevious).toHaveBeenCalled();
  });
});