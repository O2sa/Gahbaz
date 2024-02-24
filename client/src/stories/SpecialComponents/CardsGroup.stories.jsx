import { BrowserRouter } from 'react-router-dom'
import CardsGroup from './CardsGroup'
import { Provider } from 'react-redux'
import * as SpecilaCardStories from './SpecialCard.stories'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import store from 'src/lib/store'
import { MemoryRouter } from 'react-router-dom'
import Grades from 'src/student/grades'
import { Link } from 'react-router-dom';



export default {
  component: CardsGroup,
  title: 'CardsGroup',
  // decorators: [(story) => <div style={{ padding: "3rem" }}>{story()}</div>],
  tags: ['autodocs'],
  excludeStories: /.*MockedState$/,
}

export const Default = {
  decorators: [
    (story) => (
      <Provider store={store}>
          <Link to="/about">Go to About</Link>
          <CardsGroup collection={'collages'} />
      </Provider>
    ),
  ],
}

// export const WithPinnedTasks = {
//   decorators: [
//     (story) => {
//       const pinnedtasks = [
//         ...MockedState.tasks.slice(0, 5),
//         { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" },
//       ];
//       return (
//         <Mockstore
//           taskboxState={{
//             ...MockedState,
//             tasks: pinnedtasks,
//           }}
//         >
//           {story()}
//         </Mockstore>
//       );
//     },
//   ],
// };

// export const Loading = {
//   decorators: [
//     (story) => (
//       <Mockstore
//       CollagesData={{
//           ...MockedState,
//           status: "loading",
//         }}
//       >
//         {story()}
//       </Mockstore>
//     ),
//   ],
// };

// export const Empty = {
//   decorators: [
//     (story) => (
//       <Mockstore
//       CollagesData={{
//           ...MockedState,
//           collages: [],
//         }}
//       >
//         {story()}
//       </Mockstore>
//     ),
//   ],
// };
