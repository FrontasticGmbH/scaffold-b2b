import { render, screen } from '@test/utils';
import Markdown from '.';

describe('[Component] Markdown', () => {
  test('renders markdown correctly', () => {
    const content = `**Automotive Trends in 2023**\n*Automotive trends are evolving to meet our changing needs and desires.*`;
    render(<Markdown>{content}</Markdown>);

    const markdownElement = screen.getByText('Automotive Trends in 2023');
    expect(markdownElement).toBeDefined();
  });
});
