import { act, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import ActivityLog from '.';

describe('[Component] Activity log', () => {
  test('It renders activities correctly', () => {
    render(<ActivityLog activities={[{ title: '1' }, { title: '2' }]} />);

    expect(screen.getAllByTestId('activity-log').length).toBe(2);
  });

  test('It renders title & summary correctly', () => {
    render(<ActivityLog activities={[{ title: 'Title', summary: 'Summary' }]} />);

    expect(screen.getByTestId('activity-log').querySelector('h5')?.textContent).toBe('Title');
    expect(screen.getByTestId('activity-log').querySelector('h6')?.textContent).toBe('Summary');
  });

  test('It renders comment correctly', () => {
    render(<ActivityLog activities={[{ title: '', comment: "Hey, I'm a comment!" }]} />);

    expect(screen.queryByRole('form')).toBeDefined();
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe("Hey, I'm a comment!");
  });

  test('It interacts with form correctly', async () => {
    const onCommentUpdate = jest.fn();
    const onCommentCancel = jest.fn();

    render(
      <ActivityLog activities={[{ title: '', comment: "Hey, I'm a comment", onCommentUpdate, onCommentCancel }]} />,
    );

    await act(async () => userEvent.click(screen.getByRole('textbox')));

    expect(screen.getByText('common.cancel')).toBeDefined();
    expect(screen.getByText('common.send')).toBeDefined();

    await act(async () => userEvent.type(screen.getByRole('textbox'), '!'));

    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe("Hey, I'm a comment!");

    await act(async () => userEvent.click(screen.getByText('common.send')));

    expect(onCommentUpdate).toHaveBeenCalledWith("Hey, I'm a comment!");
    expect(screen.queryByText('common.cancel')).toBeNull();
    expect(screen.queryByText('common.send')).toBeNull();

    await act(async () => userEvent.click(screen.getByRole('textbox')));

    await act(async () => userEvent.click(screen.getByText('common.cancel')));

    expect(onCommentCancel).toHaveBeenCalled();
    expect(screen.queryByText('common.cancel')).toBeNull();
    expect(screen.queryByText('common.send')).toBeNull();
  });

  test('It interacts with disabled form correctly', async () => {
    render(<ActivityLog activities={[{ title: '', comment: "Hey, I'm a comment", commentDisabled: true }]} />);

    await act(async () => userEvent.click(screen.getByRole('textbox')));

    expect(screen.queryByText('common.cancel')).toBeNull();
    expect(screen.queryByText('common.send')).toBeNull();
  });

  test('It shows form errors correctly when max length is exceeded', async () => {
    //max length for a comment is 160 characters
    render(<ActivityLog activities={[{ title: '', comment: ' ' }]} />);

    await act(async () => userEvent.click(screen.getByRole('textbox')));

    await act(async () =>
      userEvent.type(
        screen.getByRole('textbox'),
        Array.from({ length: 200 })
          .map(() => '0')
          .join(''),
      ),
    );

    expect(screen.getByText('dashboard.message.too.long')).toBeDefined();
  });

  test('It can accept & reject correctly', async () => {
    const onAccept = jest.fn();
    const onReject = jest.fn();

    render(
      <ActivityLog activities={[{ title: '', reply: true, onAccept, onReject, canAccept: true, canReject: true }]} />,
    );

    expect(screen.getByText('common.accept')).toBeDefined();
    expect(screen.getByText('common.decline')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('common.accept')));

    expect(onAccept).toHaveBeenCalled();

    await act(async () => userEvent.click(screen.getByText('common.decline')));

    expect(onReject).toHaveBeenCalled();
  });

  test("It doesn't allow accepting or rejecting correctly", async () => {
    const onAccept = jest.fn();
    const onReject = jest.fn();

    render(
      <ActivityLog activities={[{ title: '', reply: true, onAccept, onReject, canAccept: false, canReject: false }]} />,
    );

    expect(screen.getByText('common.accept')).toBeDefined();
    expect(screen.getByText('common.decline')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('common.accept')));

    expect((screen.getByText('common.accept') as HTMLButtonElement).disabled).toBeTruthy();
    expect(onAccept).not.toHaveBeenCalled();

    await act(async () => userEvent.click(screen.getByText('common.decline')));

    expect((screen.getByText('common.decline') as HTMLButtonElement).disabled).toBeTruthy();
    expect(onReject).not.toHaveBeenCalled();
  });

  test('It renders & interacts with CTA link correctly', async () => {
    const onCtaLinkClick = jest.fn();

    render(<ActivityLog activities={[{ title: '', ctaLink: 'CTA Link', onCtaLinkClick }]} />);

    expect(screen.getByText('CTA Link')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('CTA Link')));

    expect(onCtaLinkClick).toHaveBeenCalled();
  });

  test('It renders & interacts with disabled CTA link correctly', async () => {
    const onCtaLinkClick = jest.fn();

    render(<ActivityLog activities={[{ title: '', ctaLink: 'CTA Link', onCtaLinkClick, ctaLinkIsDisabled: true }]} />);

    expect(screen.queryByText('CTA Link')).toBeNull();
  });

  test('It renders & interacts with CTA button correctly', async () => {
    const onCtaButtonClick = jest.fn();

    render(<ActivityLog activities={[{ title: '', ctaButton: 'CTA Button', onCtaButtonClick }]} />);

    expect(screen.getByText('CTA Button')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('CTA Button')));

    expect(onCtaButtonClick).toHaveBeenCalled();
  });

  test('It renders & interacts with disabled CTA button correctly', async () => {
    const onCtaButtonClick = jest.fn();

    render(
      <ActivityLog
        activities={[{ title: '', ctaButton: 'CTA Button', onCtaButtonClick, ctaButtonIsDisabled: true }]}
      />,
    );

    expect((screen.getByText('CTA Button') as HTMLButtonElement).disabled).toBeTruthy();

    await act(async () => userEvent.click(screen.getByText('CTA Button')));

    expect(onCtaButtonClick).not.toHaveBeenCalled();
  });

  test('It renders given translations correctly', async () => {
    render(
      <ActivityLog
        activities={[{ title: '', comment: ' ', reply: true }]}
        translations={{
          accept: 'Accept',
          decline: 'Decline',
          send: 'Send',
          cancel: 'Cancel',
        }}
      />,
    );

    await act(async () => userEvent.click(screen.getByRole('textbox')));

    expect(screen.getByText('Accept')).toBeDefined();
    expect(screen.getByText('Decline')).toBeDefined();
    expect(screen.getByText('Send')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
  });
});
