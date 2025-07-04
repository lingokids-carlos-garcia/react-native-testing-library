import * as React from 'react';
import { Text } from 'react-native';

import { act, render, screen } from '..';

const MyComponent = () => {
  const [count, setCount] = React.useState(0);

  const myPromise = async () => {
    const response = await new Promise<number>((resolve) => resolve(1));
    setCount(response);
  };

  React.useEffect(() => {
    myPromise();
  }, []);

  return count > 0 && <Text testID="count">{count}</Text>;
};

describe('component updates state on mount with async function', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('relying on waitFor to process component updates', () => {
    test('should render component', async () => {
      render(<MyComponent />);

      // `findBy` uses `waitFor` internally, which waits for microtasks via `setImmediate`
      // In this case, the test passes because it's waiting for the component update.
      // ================================
      // TEST PASSES
      // ================================
      const count = await screen.findByTestId('count');

      expect(count).toHaveTextContent('1');
    });
  });
  describe('explicitly waiting for component updates', () => {
    test('should render component', async () => {
      render(<MyComponent />);

      // Addtionally, it also passes when explicitly waiting a microtask.
      // ================================
      // TEST PASSES
      // ================================
      await act(async () => Promise.resolve());
      const count = await screen.findByTestId('count');

      expect(count).toHaveTextContent('1');
    });
  });
});
