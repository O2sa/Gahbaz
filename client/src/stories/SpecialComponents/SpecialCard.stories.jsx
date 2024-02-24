import { SpecialCard } from './Specialcard'

export default {
  component: SpecialCard,
  title: 'Components/Special Card',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = {
 args:{ 
    id: "1",
    title: "Test Task",
    subtitle: "TASK_INBOX",
  },
}

export const withoutDelete = {
  args: {
    withDeleteIcon: false,
  },
}
