import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../apis/apis.mjs'

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1)
const deleteLastChar = (word) => word.slice(0, -1)

// Utility function for async CRUD operations
const createAsyncCrudThunk = (resource) => ({
  getItemsThunk: createAsyncThunk(
    `CollagesManagement/get${capitalize(resource)}sThunk`,
    async () => await api.getItems(resource),
  ),
  createItemThunk: createAsyncThunk(
    `CollagesManagement/create${capitalize(resource)}Thunk`,
    (data) => api.createItem(resource, data),
  ),
  updateItemThunk: createAsyncThunk(
    `CollagesManagement/update${capitalize(resource)}hunk`,
    async ({ id, data }) => api.updateItem(resource, id, data),
  ),
  deleteItemThunk: createAsyncThunk(`CollagesManagement/delete${capitalize(resource)}Thunk`, (id) =>
    api.deleteItem(resource, id),
  ),
  getItemThunk: createAsyncThunk(`CollagesManagement/get${capitalize(resource)}Thunk`, (id) =>
    api.getItemById(resource, id),
  ),
})

const CollagesManagementData = {
  collages: [],
  subjects: [],
  fields: [],
  courses: [],
  semesterTemplates: [],
  semesters: [],
  status: 'idle',
  error: null,
}

export const asyncCrudThunks = {
  collages: createAsyncCrudThunk('collage'),
  subjects: createAsyncCrudThunk('subject'),
  fields: createAsyncCrudThunk('field'),
  courses: createAsyncCrudThunk('course'),
  semesterTemplates: createAsyncCrudThunk('semesterTemplate'),
  semesters: createAsyncCrudThunk('semester'),
}

export const setSuccessStatus = (state) => {
  state.status = 'succeeded'
  state.error = null
}

export const setLoadingStatus = (state) => {
  state.status = 'loading'
  state.error = null
}

export const setFailedStatus = (state) => {
  state.status = 'failed'
  state.error = 'Something went wrong'
  state.collages = []
  // Reset other resource states if needed
}

export const createAsyncCrudReducerCases = (builder, resource) => {
  builder
    .addCase(asyncCrudThunks[resource].createItemThunk.fulfilled, (state, action) => {
      setSuccessStatus(state)
      state[resource].push(action.payload[resource.slice(0, -1)])
      state[deleteLastChar(resource)] = action.payload[deleteLastChar(resource)]

    })

    .addCase(asyncCrudThunks[resource].updateItemThunk.fulfilled, (state, action) => {
      setSuccessStatus(state)
      state[resource] = state[resource].map((item) =>
        item.id === action.payload[resource.slice(0, -1)].id
          ? action.payload[resource.slice(0, -1)]
          : item,
      )
    })
    .addCase(asyncCrudThunks[resource].deleteItemThunk.fulfilled, (state, action) => {
      setSuccessStatus(state)
      state[resource] = state[resource].filter((item) => item.id !== action.payload)
    })
    .addCase(asyncCrudThunks[resource].getItemsThunk.fulfilled, (state, action) => {
      setSuccessStatus(state)
      state[resource] = action.payload[resource]
    })
    .addCase(asyncCrudThunks[resource].getItemThunk.fulfilled, (state, action) => {
      setSuccessStatus(state)
      state[deleteLastChar(resource)] = action.payload[deleteLastChar(resource)]
    })
}

export const CollagesManagementSlice = createSlice({
  name: 'CollagesManagement',
  initialState: CollagesManagementData,
  reducers: {},

  extraReducers(builder) {
    // Add cases for each resource
    Object.keys(asyncCrudThunks).forEach((resource) => {
      createAsyncCrudReducerCases(builder, resource)
    })

    // Set loading status for all actions
    builder.addMatcher(
      (action) =>
        Object.values(asyncCrudThunks).some((thunk) => Object.values(thunk).includes(action.type)),
      setLoadingStatus,
    )

    // Set failed status for all actions
    builder.addMatcher(
      (action) =>
        Object.values(asyncCrudThunks).some((thunk) => Object.values(thunk).includes(action.type)),
      setFailedStatus,
    )
  },
})

export const sidebarSlice = createSlice({
  name: 'SidebarState',
  initialState: {
    sidebarShow: true,
    sidebarUnfoldable: true,
  },
  reducers: {
    updateSidebarState: (state, action) => {
      const { id, newTaskState } = action.payload
      state = { ...state, ...action.payload }
    },
  },
})
export const { updateSidebarState } = sidebarSlice.actions
