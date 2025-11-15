import { render, screen } from '@testing-library/react';
import Main from '../src/pages/Main';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios', () => {
  const mocked = {
    create: jest.fn(() => mocked),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
  };
  return mocked;
});

afterEach(() => {
  jest.resetAllMocks();
});

test('Main loads nets from API', async () => {
  axios.get.mockResolvedValue({
    data: [
      { _id: '1', name: 'Net A' },
      { _id: '2', name: 'Net B' },
    ],
  });

  render(
    <MemoryRouter>
      <Main token="test" currentUser={{}} />
    </MemoryRouter>
  );

  const netA = await screen.findAllByText('Net A');
  expect(netA.length).toBeGreaterThan(0);

  const netB = await screen.findAllByText('Net B');
  expect(netB.length).toBeGreaterThan(0);
});
