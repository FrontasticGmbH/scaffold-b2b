import { act, cleanup, render, screen } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Tabs from '.';
import { TabsContextProps } from './context/types';

describe('[Component] Tabs', () => {
  const renderTabs = (props: TabsContextProps) => {
    return render(
      <Tabs {...props}>
        <Tabs.TabList>
          <Tabs.Tab>
            <span>Tab 1</span>
          </Tabs.Tab>
          <Tabs.Tab>
            <span>Tab 2</span>
          </Tabs.Tab>
        </Tabs.TabList>
        <Tabs.Panels>
          <Tabs.Panel>
            <span>Panel 1</span>
          </Tabs.Panel>
          <Tabs.Panel>
            <span>Panel 2</span>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>,
    );
  };

  test('It renders first panel by default', () => {
    renderTabs({});

    expect(screen.getByText('Panel 1')).toBeDefined();
    expect(screen.queryByText('Panel 2')).toBeNull();
  });

  test('It renders default panel correctly', () => {
    renderTabs({ defaultActiveIndex: 1 });

    expect(screen.queryByText('Panel 1')).toBeNull();
    expect(screen.getByText('Panel 2')).toBeDefined();
  });

  test('It switches between tabs correctly', async () => {
    const onActiveIndexChange = jest.fn();

    renderTabs({ onActiveIndexChange });

    await act(async () => userEvent.click(screen.getByText('Tab 2')));

    expect(onActiveIndexChange).toHaveBeenNthCalledWith(1, 1);
    expect(screen.queryByText('Panel 1')).toBeNull();
    expect(screen.getByText('Panel 2')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('Tab 1')));

    expect(onActiveIndexChange).toHaveBeenNthCalledWith(2, 0);
    expect(screen.getByText('Panel 1')).toBeDefined();
    expect(screen.queryByText('Panel 2')).toBeNull();
  });

  test('It prevents overflowing panels', () => {
    renderTabs({ defaultActiveIndex: 3 });

    expect(screen.queryByText('Panel 1')).toBeNull();
    expect(screen.getByText('Panel 2')).toBeDefined();

    cleanup();

    renderTabs({ defaultActiveIndex: -1 });
    expect(screen.getByText('Panel 1')).toBeDefined();
    expect(screen.queryByText('Panel 2')).toBeNull();
  });
});
