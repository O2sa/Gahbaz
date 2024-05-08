// lessonSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLesson: false,
}

const lessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    setIsLesson: (state, action) => {
      state.isLesson = action.payload
      console.log('fluid container', 'state:' + action.payload)
    },
  },
})

export const { setIsLesson } = lessonSlice.actions

export const selectIsLesson = (state) => state.lesson.isLesson

export default lessonSlice.reducer
