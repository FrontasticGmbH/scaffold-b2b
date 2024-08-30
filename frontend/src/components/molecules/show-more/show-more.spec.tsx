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

    expect(screen.getByText('common.show.all')).toBeInTheDocument();
  });

  it('should toggle display when the label is clicked', async () => {
    render(
      <ShowMore>
        <>Test</>
      </ShowMore>,
    );

    const shoMoreText = screen.getByText('common.show.all');
    expect(shoMoreText).toBeInTheDocument();

    fireEvent.click(shoMoreText);

    expect(await screen.findByText('common.show.less')).toBeInTheDocument();
    expect(screen.queryByText('common.show.all')).not.toBeInTheDocument();
  });
});
