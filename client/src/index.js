import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);


/** 
 * ReactDOM.render: This function renders the App component into the DOM element with the ID root (defined in public/index.html).
 * Provider: Makes the Redux store available to the rest of the app, allowing components to access the state and dispatch actions.
 */