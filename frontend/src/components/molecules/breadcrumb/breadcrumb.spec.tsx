import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Breadcrumb from '.';

describe('[Component] Breadcrumb', () => {
  test('It renders all items correctly', () => {
    render(
      <Breadcrumb>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </Breadcrumb>,
    );

    expect(screen.getAllByRole('listitem').length).toBe(3);
    expect(screen.getAllByRole('listitem')[0].textContent).toContain('1');
    expect(screen.getAllByRole('listitem')[1].textContent).toContain('2');
    expect(screen.getAllByRole('listitem')[2].textContent).toContain('3');
  });

  test('It renders separator correctly', () => {
    render(
      <Breadcrumb Separator=">">
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </Breadcrumb>,
    );

    expect(screen.getAllByRole('listitem')[0].textContent).toBe('1>');
    expect(screen.getAllByRole('listitem')[1].textContent).toBe('2>');
    expect(screen.getAllByRole('listitem')[2].textContent).toBe('3');
  });

  test('It renders only max items correctly', () => {
    render(
      <Breadcrumb maxItems={3}>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
      </Breadcrumb>,
    );

    expect(screen.getAllByRole('listitem').length).toBe(4);
    expect(screen.getAllByRole('listitem')[0].textContent).toContain('1');
    expect(screen.getAllByRole('listitem')[1].textContent).toContain('2');
    expect(screen.getAllByRole('listitem')[1].querySelector('[data-testid="truncate-icon"]')).toBeDefined();
    expect(screen.getAllByRole('listitem')[3].textContent).toContain('6');
  });

  test('It shows truncated items correctly', async () => {
    render(
      <Breadcrumb maxItems={3}>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
      </Breadcrumb>,
    );

    await act(async () => userEvent.click(screen.getByTestId('truncate-icon')));

    expect(screen.getByRole('menu')).toBeDefined();
    expect(screen.getByRole('menu').querySelectorAll('button').length).toBe(3);
    expect(screen.getByRole('menu').querySelectorAll('button')[0].textContent).toBe('3');
    expect(screen.getByRole('menu').querySelectorAll('button')[1].textContent).toBe('4');
    expect(screen.getByRole('menu').querySelectorAll('button')[2].textContent).toBe('5');
  });
});
