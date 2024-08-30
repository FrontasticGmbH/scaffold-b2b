import { render, screen } from '@test/utils';
import Link from '.';

describe('[Component] Link', () => {
  test('It renders children correctly', () => {
    render(<Link href="">Click Me</Link>);

    expect(screen.getByRole('link').textContent).toBe('Click Me');
  });

  test('It builds absolute href correctly with default locale', () => {
    render(<Link href="/path/to/page" />);

    // `en` locale comes from `useParams` mock under `/__mocks__/next/navigation
    expect(screen.getByRole('link').getAttribute('href')).toBe('/en/path/to/page');
  });

  test('It builds absolute href correctly with given locale', () => {
    render(<Link href="/path/to/page" locale="en-gb" />);

    expect(screen.getByRole('link').getAttribute('href')).toBe('/en-gb/path/to/page');
  });

  test('It builds full href correctly', () => {
    render(<Link href="https://example.com/path/to/page" />);

    expect(screen.getByRole('link').getAttribute('href')).toBe('https://example.com/path/to/page');
  });

  test('It builds relative href correctly', () => {
    render(<Link href="path/to/page" />);

    expect(screen.getByRole('link').getAttribute('href')).toBe('path/to/page');
  });

  test('It builds query params only href correctly', () => {
    render(<Link href="?a=b&c=d" />);

    expect(screen.getByRole('link').getAttribute('href')).toBe('?a=b&c=d');
  });

  test('It can open in a new tab', () => {
    render(<Link href="" openInNewTab />);

    expect(screen.getByRole('link').getAttribute('target')).toBe('_blank');
  });

  test('It can open on the same tab', () => {
    render(<Link href="" openInNewTab={false} />);

    expect(screen.getByRole('link').getAttribute('target')).toBe('_self');
  });

  test('It supports underline on hovering', () => {
    render(<Link href="" underlineOnHover />);

    expect(screen.getByRole('link').className).toContain('underline-offset-4 hover:underline');
  });

  test('It supports adding a chevron', () => {
    render(
      <Link href="" chevron>
        Click Me
      </Link>,
    );

    expect(screen.getByRole('link').className).toContain('flex items-center gap-1');
    expect(screen.getByRole('link').childNodes.length).toBe(2);
    expect(screen.getByRole('link').querySelector('svg')).toBeDefined();
  });
});
