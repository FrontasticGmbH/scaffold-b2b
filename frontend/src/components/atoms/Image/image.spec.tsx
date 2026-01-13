import { render, screen } from '@test/utils';
import Image from '.';

jest.mock(
  './loaders/default/index.ts',
  () =>
    ({ src }: { src: string }) =>
      src,
);

jest.mock('next-cloudinary', () => {
  return {
    CldImage: ({ src, alt }: { src: string; alt: string }) => {
      return <img src={src} alt={alt} />;
    },
  };
});

describe('[Component] Image', () => {
  test('It renders images with media ID correctly', () => {
    render(<Image media={{ mediaId: 'MEDIA_ID' }} src="SRC" alt="IMG" />);

    expect(screen.getByAltText('IMG').getAttribute('src')).toBe('MEDIA_ID');
  });

  test('It renders image with no media ID correctly', () => {
    render(<Image src="SRC" alt="IMG" />);

    expect(screen.getByAltText('IMG').getAttribute('src')).toBe('SRC');
  });

  test('It sets width and height correctly for non-fill images', () => {
    render(<Image src="SRC" width={10} height={10} alt="IMG" />);

    expect(screen.getByAltText('IMG').getAttribute('width')).toBe('10');
    expect(screen.getByAltText('IMG').getAttribute('height')).toBe('10');
  });

  test('It does not set width and height correctly for fill images', () => {
    render(
      <div style={{ position: 'relative', height: '300px' }}>
        <Image src="SRC" width={10} height={10} fill alt="IMG" />
      </div>,
    );

    expect(screen.getByAltText('IMG').getAttribute('width')).toBeNull();
    expect(screen.getByAltText('IMG').getAttribute('height')).toBeNull();
  });
});
