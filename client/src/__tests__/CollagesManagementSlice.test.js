// CollagesManagementSlice.test.js

import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {CollagesManagementSlice,
  asyncCrudThunks,
  setLoadingStatus,
  setFailedStatus,
  setSuccessStatus,
  createAsyncCrudReducerCases,
} from '../dataLogic/CollageManagementSlice.mjs';


// Your component that uses the Redux store
const TestComponent = () => {
  // Render something here
  return <div>Test Component</div>;
};

// Mock your API functions
jest.mock('../apis/apis.mjs', () => ({
  getItems: jest.fn(),
  createItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn(),
}));

describe('CollagesManagementSlice reducers', () => {
  test('setLoadingStatus sets loading status correctly', () => {
    const state = { status: 'idle' };
    setLoadingStatus(state);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('setFailedStatus sets failed status correctly', () => {
    const state = { status: 'idle' };
    setFailedStatus(state);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Something went wrong');
    expect(state.collages).toEqual([]);
  });

  test('setSuccessStatus sets success status correctly', () => {
    const state = { status: 'loading' };
    setSuccessStatus(state);
    expect(state.status).toBe('succeeded');
    expect(state.error).toBeNull();
  });

  test('createAsyncCrudReducerCases handles actions correctly', () => {
    const builder = {
      addCase: jest.fn(),
      addMatcher: jest.fn(),
    };
    const resource = 'collages';

    createAsyncCrudReducerCases(builder, resource);

    // Your assertions on the mocked addCase and addMatcher functions go here
  });
});

test('renders without crashing', () => {
  const store = configureStore({
    reducer: CollagesManagementSlice.reducer,
  });

  render(
    <Provider store={store}>
      <TestComponent />
    </Provider>
  );

  // Your test assertions go here
});
