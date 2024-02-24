import { AddCollage } from './AddCollage'
import React, { useState } from 'react'
import { Button } from '../components/button'
import { Provider } from 'react-redux'
import store from 'src/lib/store'
export default {
  component: AddCollage,
  title: 'Screens/AddCollage',
  tags: ['autodocs'],
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
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
      <AddCollage visible={visible} setVisible={setVisible} />
    </>
  )
}
