// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // 변경된 부분
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootswatch/dist/lux/bootstrap.min.css'; // Lux 테마 적용 코드

const container = document.getElementById('root'); // 컨테이너를 가져옵니다.
const root = createRoot(container); // createRoot를 사용하여 루트를 생성합니다.

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

