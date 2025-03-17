import { fireEvent, render, screen } from '__test__/utils';
import ShowMore from '.';

describe('ShowMore', () => {
  it('should render a label if one is passed to it', () => {
    const Label = () => {
      return <label>a placeholder label</label>;
    };

    render(
      <ShowMore renderLabel={Label}>
        <>Test</>
      </ShowMore>,
    );

    expect(screen.getByText('a placeholder label')).toBeInTheDocument();
  });

  it('should render the default label if no label is passed to it', () => {
    render(
      <ShowMore>
        <>Test</>
      </ShowMore>,
    );

    expect(screen.getByText('Show all')).toBeInTheDocument();
  });

  it('should toggle display when the label is clicked', async () => {
    render(
      <ShowMore>
        <>Test</>
      </ShowMore>,
    );

    const shoMoreText = screen.getByText('Show all');
    expect(shoMoreText).toBeInTheDocument();

    fireEvent.click(shoMoreText);

    expect(await screen.findByText('Show less')).toBeInTheDocument();
    expect(screen.queryByText('Show all')).not.toBeInTheDocument();
  });
});
