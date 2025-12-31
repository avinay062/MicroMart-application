import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


/** 
 * ReactDOM.render: This function renders the App component into the DOM element with the ID root (defined in public/index.html).
StrictMode: Helps identify potential problems in the app by enabling additional checks and warnings during development.

*/
