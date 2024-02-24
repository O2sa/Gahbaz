import { Button } from './button'
import icon from '../assets/editIcon_2.svg'

export default {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    direction: 'rtl',
  },
}
export const Medium = {
  args: {},
}

export const Light = {
  args: {
    color: 'light',
  },
}

export const Small = {
  args: {
    size: 'sm',
  },
}

export const Outline = {
  args: {
    variant: 'outline',
  },
}
export const WithIcon = {
  args: {
    icon: icon,
    variant: 'outline',
    className: ''
  },
}
