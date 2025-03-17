import { render, screen, fireEvent, waitFor } from '@test/utils';
import InfoTooltip from '.';

describe('[Component] Info Tooltip', () => {
  it('Renders children', () => {
    render(<InfoTooltip content="I'm a tooltip">Hover me!</InfoTooltip>);

    expect(screen.getByText('Hover me!')).toBeInTheDocument();
  });

  it('Toggles tooltip on hover effect', () => {
    render(<InfoTooltip content="I'm a tooltip">Hover me!</InfoTooltip>);

    expect(screen.queryByText("I'm a tooltip")).not.toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByTestId('tooltip-icon'));

    expect(screen.getByText("I'm a tooltip")).toBeInTheDocument();

    fireEvent.mouseLeave(screen.getByTestId('tooltip-icon'));

    waitFor(
      () => {
        expect(screen.queryByText("I'm a tooltip")).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });
});
