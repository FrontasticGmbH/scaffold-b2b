import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerticalSlider from './';

jest.mock('react-slick', () => {
  const SlickMock = jest.fn(({ children, nextArrow, prevArrow }) => (
    <div>
      {/* Render next and previous arrows */}
      {prevArrow && prevArrow}
      {nextArrow && nextArrow}
      <div data-testid="slides">{children}</div>
    </div>
  ));
  return SlickMock;
});

describe('VerticalSlider', () => {
  const slides = [
    <div key="1" data-testid="slide">
      Slide 1
    </div>,
    <div key="2" data-testid="slide">
      Slide 2
    </div>,
    <div key="3" data-testid="slide">
      Slide 3
    </div>,
    <div key="4" data-testid="slide">
      Slide 4
    </div>,
    <div key="5" data-testid="slide">
      Slide 5
    </div>,
  ];

  it('renders VerticalSlider with default settings', () => {
    render(<VerticalSlider>{slides}</VerticalSlider>);

    const renderedSlides = screen.getAllByTestId('slide');
    expect(renderedSlides).toHaveLength(slides.length);

    expect(renderedSlides[0]).toHaveTextContent('Slide 1');
    expect(renderedSlides[1]).toHaveTextContent('Slide 2');
  });

  it('renders navigation arrows', () => {
    render(
      <VerticalSlider
        prevArrow={<button data-testid="custom-prev">Prev</button>}
        nextArrow={<button data-testid="custom-next">Next</button>}
      >
        {slides}
      </VerticalSlider>,
    );

    const prevArrow = screen.getByTestId('custom-next');
    const nextArrow = screen.getByTestId('custom-prev');

    expect(prevArrow).toBeInTheDocument();
    expect(nextArrow).toBeInTheDocument();
  });

  test('clicking next arrow triggers slickNext', async () => {
    const onNextClick = jest.fn();

    render(
      <VerticalSlider
        nextArrow={
          <button data-testid="custom-next" onClick={onNextClick}>
            Next
          </button>
        }
      >
        {slides}
      </VerticalSlider>,
    );

    const nextArrow = screen.getByTestId('custom-next');
    await userEvent.click(nextArrow);

    expect(onNextClick).toHaveBeenCalled();
  });

  test('clicking prev arrow triggers slickPrev', async () => {
    const onPrevClick = jest.fn();

    render(
      <VerticalSlider
        prevArrow={
          <button data-testid="custom-prev" onClick={onPrevClick}>
            Next
          </button>
        }
      >
        {slides}
      </VerticalSlider>,
    );

    const prevArrow = screen.getByTestId('custom-prev');

    await userEvent.click(prevArrow);

    await waitFor(() => {
      expect(onPrevClick).toHaveBeenCalled();
    });
  });
});
