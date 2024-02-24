import { CurrentSemester } from './CurrentSemester'
import React, { useState } from 'react'
import { Button } from '../components/button'
export default {
  component: CurrentSemester,
  title: 'Screens/CurrentSemester',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl',
  },
}

export const Default = () => {


    
  return (
      <CurrentSemester  />
  )
}
