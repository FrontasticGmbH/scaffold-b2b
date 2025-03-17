import { render, screen } from '@test/utils';
import InfoBanner from './';
import useClassNames from './hooks/useClassNames';

jest.mock('./hooks/useClassNames', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('InfoBanner Component', () => {
  const mockUseClassNames = useClassNames as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseClassNames.mockImplementation(({ variant }) => ({
      bannerClassName: variant === 'primary' ? 'mock-primary-banner-class' : 'mock-warning-banner-class',
      sidebarClassName: variant === 'primary' ? 'mock-primary-sidebar-class' : 'mock-warning-sidebar-class',
    }));
  });

  it('applies correct class names for the "primary" variant', () => {
    render(<InfoBanner variant="primary">Primary Variant</InfoBanner>);

    const banner = screen.getByText('Primary Variant').parentElement;

    expect(banner).toHaveClass('mock-primary-banner-class');

    const sidebar = banner?.querySelector('span');
    expect(sidebar).toHaveClass('mock-primary-sidebar-class');
  });

  it('applies correct class names for the "warning" variant', () => {
    render(<InfoBanner variant="warning">Warning Variant</InfoBanner>);

    const banner = screen.getByText('Warning Variant').parentElement;
    expect(banner).toHaveClass('mock-warning-banner-class');

    const sidebar = banner?.querySelector('span');
    expect(sidebar).toHaveClass('mock-warning-sidebar-class');
  });

  it('renders children content', () => {
    render(<InfoBanner>Test Children Content</InfoBanner>);

    expect(screen.getByText('Test Children Content')).toBeInTheDocument();
  });

  it('applies custom className provided via props', () => {
    render(<InfoBanner className="custom-class">Custom Class Test</InfoBanner>);

    const banner = screen.getByText('Custom Class Test').parentElement;
    expect(banner).toHaveClass('mock-primary-banner-class');
    expect(banner).toHaveClass('custom-class');
  });
});
