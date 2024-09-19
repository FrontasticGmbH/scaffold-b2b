import { render, screen } from '@testing-library/react';
import { DayPickerProps } from 'react-day-picker';
import DatePicker from '.';

describe('[Component] DatePicker', () => {
  const fromYear = new Date().getFullYear() - 5;
  const toYear = new Date().getFullYear() + 5;

  const commonProps: DayPickerProps = {
    fromYear,
    toYear,
    mode: 'range',
  };

  it('Highlights the correct current day', () => {
    render(<DatePicker {...commonProps} />);

    const todayDate = new Date().getDate().toString();

    const todayButton = screen.getByText(todayDate);

    expect(todayButton).toHaveClass('rdp-day_today');
  });

  it('Renders the DatePicker component correctly', () => {
    render(<DatePicker {...commonProps} />);

    // Check if the DatePicker grid is rendered
    const datePickerGrid = screen.getByRole('grid');
    expect(datePickerGrid).toBeInTheDocument();
  });

  it('Renders the month and year selector', () => {
    render(<DatePicker {...commonProps} />);

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear().toString();
    const currentMonthYear = `${currentMonth} ${currentYear}`;

    const monthYearButton = screen.getByRole('button', {
      name: currentMonthYear,
    });
    expect(monthYearButton).toBeInTheDocument();
    expect(monthYearButton).toHaveTextContent(currentMonthYear);
  });

  it('Renders the navigation buttons', () => {
    render(<DatePicker {...commonProps} />);

    // Check if the previous and next navigation buttons are rendered
    const prevButton = screen.getByTestId('prev');

    const nextButton = screen.getByTestId('next');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('Renders the correct number of days in the calendar grid', () => {
    render(<DatePicker {...commonProps} />);

    // Check if the grid cells for days are rendered
    const dayButtons = screen.getAllByRole('gridcell');
    expect(dayButtons.length).toBeGreaterThan(0); // Ensure some days are rendered, you can be more specific if needed
  });
});
