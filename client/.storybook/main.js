/** @type { import('@storybook/react-webpack5').StorybookConfig } */
import { makeServer } from '../src/server'
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    'storybook-addon-rtl',
    'storybook-addon-react-router-v6',
    "storybook-mirage", //👈 the addon registered here
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  async beforeStart() {
    makeServer()
  },
}
export default config
