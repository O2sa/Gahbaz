import Collages from './Collages';
import store from '../../lib/store';

import { Provider } from 'react-redux';

export default {
  component: Collages,
  title: 'Screens/Collages',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {};