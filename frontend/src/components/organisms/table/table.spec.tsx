import { act, createWrapper, render, screen } from '@test/utils';
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
            <Table.HeaderCell>H1</Table.HeaderCell>
            <Table.HeaderCell>H2</Table.HeaderCell>
            <Table.HeaderCell>H3</Table.HeaderCell>
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
      wrapper: createWrapper(),
    });

    expect(screen.getAllByText('1 - 25 of 100')[0]).toBeDefined();

    rerender(<Table.Pagination page={2} limit={25} totalItems={200} />);

    expect(screen.getAllByText('26 - 50 of 200')[0]).toBeDefined();
  });

  it('Disables next and previous buttons correctly', () => {
    const { rerender } = render(<Table.Pagination page={1} limit={25} totalItems={100} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId('previous-arrow')).toBeDisabled();
    expect(screen.getByTestId('next-arrow')).not.toBeDisabled();

    rerender(<Table.Pagination page={4} limit={25} totalItems={100} />);

    expect(screen.getByTestId('previous-arrow')).not.toBeDisabled();
    expect(screen.getByTestId('next-arrow')).toBeDisabled();
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
      { wrapper: createWrapper() },
    );

    await act(async () => userEvent.click(screen.getByTestId('dropdown-button')));
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
