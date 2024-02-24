/** @type { import('@storybook/react').Preview } */
// import 'bootstrap/dist/css/bootstrap.min.css';
import { makeServer } from '../src/server'

import './style.css';
import "../src/scss/style.scss";
import { addDecorator } from '@storybook/react';
import { MemoryRouter, Router } from 'react-router-dom';
import { initializeRTL } from "storybook-addon-rtl";
import React from 'react';
initializeRTL();
makeServer()

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export const decorators = [
  (Story) => (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  ),
];
export default preview
