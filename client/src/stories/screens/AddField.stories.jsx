import { AddField } from './AddField'
import React, { useState } from 'react'
import { Button } from '../components/button'
export default {
  component: AddField,
  title: 'Screens/AddField',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {
  const [visible, setVisible] = useState(true)

  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Launch demo modal</Button>
      <AddField visible={visible} setVisible={setVisible} />
    </>
  )
}
