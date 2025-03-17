import React from 'react';
import { render, screen, waitFor } from '@test/utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // For extended DOM assertions
import Accordion from './';

describe('Accordion Component', () => {
  it('renders the Accordion with children', () => {
    render(
      <Accordion>
        <Accordion.Button>Toggle</Accordion.Button>
        <Accordion.Panel>Content</Accordion.Panel>
      </Accordion>,
    );

    expect(screen.getByText('Toggle')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('toggles the Accordion content visibility using class', async () => {
    render(
      <Accordion>
        <Accordion.Button>Toggle</Accordion.Button>
        <Accordion.Panel>Content</Accordion.Panel>
      </Accordion>,
    );

    const button = screen.getByText('Toggle');
    const contentWrapper = screen.getByText('Content').parentElement; // The wrapper with the class `visible`

    expect(contentWrapper).not.toHaveClass('visible');

    await userEvent.click(button);

    await waitFor(() => {
      expect(contentWrapper).toHaveClass('visible');
    });

    await userEvent.click(button);

    await waitFor(() => {
      expect(contentWrapper).not.toHaveClass('visible');
    });
  });

  it('defaultIsExpanded prop expands the Accordion by default', () => {
    render(
      <Accordion defaultIsExpanded>
        <Accordion.Button>Toggle</Accordion.Button>
        <Accordion.Panel>Content</Accordion.Panel>
      </Accordion>,
    );

    const content = screen.getByText('Content');
    expect(content).toBeVisible();
  });

  it('onExpand and onCollapse callbacks are called', async () => {
    const onExpand = jest.fn();
    const onCollapse = jest.fn();

    render(
      <Accordion defaultIsExpanded={false} onExpand={() => onExpand()} onCollapse={() => onCollapse()}>
        <Accordion.Button>Toggle</Accordion.Button>
        <Accordion.Panel>Content</Accordion.Panel>
      </Accordion>,
    );

    const button = screen.getByText('Toggle');

    // Expand
    await userEvent.click(button);
    expect(onExpand).toHaveBeenCalledTimes(1);

    // Collapse
    await userEvent.click(button);
    expect(onCollapse).toHaveBeenCalledTimes(1);
  });

  it('renders the arrow and toggles its rotation', async () => {
    render(
      <Accordion>
        <Accordion.Button withArrow>Toggle</Accordion.Button>
        <Accordion.Panel>Content</Accordion.Panel>
      </Accordion>,
    );

    const button = screen.getByText('Toggle');
    const arrow = screen.getByTestId('arrow-icon');

    expect(arrow).not.toHaveClass('rotate-180');

    await userEvent.click(button);
    expect(arrow).toHaveClass('rotate-180');
  });

  it('custom class names are applied correctly', () => {
    render(
      <Accordion className="custom-accordion">
        <Accordion.Button className="custom-button">Toggle</Accordion.Button>
        <Accordion.Panel className="custom-panel">Content</Accordion.Panel>
      </Accordion>,
    );

    expect(screen.getByText('Toggle').parentElement).toHaveClass('custom-button');
    expect(screen.getByText('Content')).toHaveClass('custom-panel');
  });
});
