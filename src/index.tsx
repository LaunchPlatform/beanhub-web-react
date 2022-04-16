import React from "react";
import ReactDOM from "react-dom";
import TransactionForm, {
  Props as TransactionFormProps,
} from "./TransactionForm/Form";
import OpenForm, { Props as OpenFormProps } from "./OpenForm/Form";

// TODO: maybe there's a better way to expose it?
(window as any).renderTransactionForm = (
  element: HTMLElement,
  props: TransactionFormProps
) => {
  ReactDOM.render(
    <React.StrictMode>
      <TransactionForm {...props} />
    </React.StrictMode>,
    element
  );
};

(window as any).renderOpenForm = (
  element: HTMLElement,
  props: OpenFormProps
) => {
  ReactDOM.render(
    <React.StrictMode>
      <OpenForm {...props} />
    </React.StrictMode>,
    element
  );
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
