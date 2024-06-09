import 'react-app-polyfill/stable'
import 'core-js'
import React, { useEffect } from 'react'
import ReactDOM from "react-dom/client";

import { createRoot } from 'react-dom/client'
import App from './App'
// import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
// import store from './store'
import { Router, HashRouter, useLocation } from 'react-router-dom'

import { makeServer } from './server.js'
// import Testing from './test_api_comp'
import testingStore from './lib/store'
import store from './lib/store'


ReactDOM.createRoot(document.getElementById("root")).render(
  
  <Provider store={testingStore}>
    <App />
    {/* <Testing /> */}
  </Provider>
);


// ReactDOM.render(
//   <Provider store={testingStore}>
//     <App />
//     {/* <Testing /> */}
//   </Provider>,
//   document.getElementById('root'),
// )

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
