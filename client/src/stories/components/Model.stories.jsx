import Model from './Model'
import React, { useState } from 'react'
import { Button } from './button'

export default {
  component: Model,
  title: 'Components/Model',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {
  const [visible, setVisible] = useState(true)

  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Launch demo modal</Button>
      <Model
        visible={visible}
        setVisible={setVisible}

        modelBody={
          <>
            <p>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
              facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
              at eros.
            </p>
          </>
        }
      />
    </>
  )
}

export const Form = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Launch demo modal</Button>
      <Model
        visible={visible}
        modelBody={
          <>
            <p>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
              facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
              at eros.
            </p>
          </>
        }
        setVisible={setVisible}
        variant={'form'}
      />
    </>
  )
}
