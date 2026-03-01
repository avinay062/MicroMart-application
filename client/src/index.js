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
// let printName = function(hometown) {
//   console.log(this.firstName + " " + this.lastName + "," + hometown);
// }

// Function.prototype.mybind = function(...args){
//   let obj = this;
//   let params = args.slice(1);
//   return function(...innerArgs) {
//     obj.apply(args[0], [...params, ...innerArgs]);
//   }
// }

// let printMyName = printName.mybind(name);
// printMyName("New York");



// // debouncing in js

// let counte = 0;
// // get will call on key up event
// const getData =() => {
//    console.log("Fetching data...", counte++);
// }

// const doSomeMagic = function(fn, delay){
//   return function () {
//     let context = this;
//     let args = arguments;
//     clearTimeout(fn.id);
//     fn.id = setTimeout(() => {
//       fn.apply(context, args);
//     },delay);
//   }
// }

// const betterFunction = doSomeMagic(getData, 300);

// // betterFunction will call after 300ms of last key up event
// document.getElementById("myInput").addEventListener("keyup", betterFunction);