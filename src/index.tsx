import React from "react";
import ReactDOM from "react-dom";
import Form, { Props } from "./TransactionForm/Form";

export const renderTransactionForm = (element: HTMLElement, props: Props) => {
  ReactDOM.render(
    <React.StrictMode>
      <Form {...props} />
    </React.StrictMode>,
    element
  );
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
