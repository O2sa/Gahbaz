// Utility function for async CRUD operations
const createAsyncCrudThunk = (resource) => ({
    getItemsThunk: createAsyncThunk(
      `CollagesManagement/getItemsThunk`,
      async () => await api.getItems(resource),
    ),
    createItemThunk: createAsyncThunk(`CollagesManagement/createItemThunk`, (data) =>
      api.createItem(resource, data),
    ),
    updateItemThunk: createAsyncThunk(`CollagesManagement/updateItemThunk`, async ({ id, data }) =>
      api.updateItem(resource, id, data),
    ),
    deleteItemThunk: createAsyncThunk(`CollagesManagement/deleteItemThunk`, (id) =>
      api.deleteItem(resource, id),
    ),
  });
  
  const CollagesManagementData = {
    collages: [],
    subjects: [],
    fields: [],
    courses: [],
    semesterTemplates: [],
    semesters: [],
    status: 'idle',
    error: null,
  };
  
  const asyncCrudThunks = {
    collages: createAsyncCrudThunk('collage'),
    subjects: createAsyncCrudThunk('subject'),
    fields: createAsyncCrudThunk('field'),
    courses: createAsyncCrudThunk('course'),
    semesterTemplates: createAsyncCrudThunk('semesterTemplate'),
    semesters: createAsyncCrudThunk('semester'),
  };
  
  const setSuccessStatus = (state) => {
    state.status = 'succeeded';
    state.error = null;
  };
  
  const setLoadingStatus = (state) => {
    state.status = 'loading';
    state.error = null;
  };
  
  const setFailedStatus = (state) => {
    state.status = 'failed';
    state.error = 'Something went wrong';
    state.collages = [];
    // Reset other resource states if needed
  };
  
  const createAsyncCrudReducerCases = (builder, resource) => {
    builder
      .addCase(asyncCrudThunks[resource].createItemThunk.fulfilled, (state, action) => {
        setSuccessStatus(state);
        state[resource].push(action.payload[resource.slice(0, -1)]);
      })
      .addCase(asyncCrudThunks[resource].updateItemThunk.fulfilled, (state, action) => {
        setSuccessStatus(state);
        state[resource] = state[resource].map((item) =>
          item.id === action.payload[resource.slice(0, -1)].id
            ? action.payload[resource.slice(0, -1)]
            : item,
        );
      })
      .addCase(asyncCrudThunks[resource].deleteItemThunk.fulfilled, (state, action) => {
        setSuccessStatus(state);
        state[resource] = state[resource].filter((item) => item.id !== action.payload);
      })
      .addCase(asyncCrudThunks[resource].getItemsThunk.fulfilled, (state, action) => {
        setSuccessStatus(state);
        state[resource] = action.payload[resource];
      });
  };
  
  export const CollagesManagementSlice = createSlice({
    name: 'CollagesManagement',
    initialState: CollagesManagementData,
    reducers: {},
  
    extraReducers(builder) {
      // Add cases for each resource
      Object.keys(asyncCrudThunks).forEach((resource) => {
        createAsyncCrudReducerCases(builder, resource);
      });
  
      // Set loading status for all actions
      builder.addMatcher(
        (action) =>
          Object.values(asyncCrudThunks).some((thunk) =>
            Object.values(thunk).includes(action.type),
          ),
        setLoadingStatus,
      );
  
      // Set failed status for all actions
      builder.addMatcher(
        (action) =>
          Object.values(asyncCrudThunks).some((thunk) =>
            Object.values(thunk).includes(action.type),
          ),
        setFailedStatus,
      );
    },
  });
  