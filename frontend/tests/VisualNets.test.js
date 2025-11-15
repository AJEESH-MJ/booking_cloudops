import { render, screen } from '@testing-library/react';
import VisualNets from '../src/components/VisualNets';

test('shows nets', () => {
  render(
    <VisualNets
      nets={[
        { _id: '1', name: 'Net A' },
        { _id: '2', name: 'Net B' },
      ]}
      selected={null}
      onSelect={() => {}}
    />
  );

  expect(screen.getByText('Net A')).toBeInTheDocument();
  expect(screen.getByText('Net B')).toBeInTheDocument();
});
