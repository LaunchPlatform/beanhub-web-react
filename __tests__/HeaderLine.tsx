/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { it, expect, describe } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import React from "react";

import HeaderLine from "../src/Shared/HeaderLine";
import Form, { FieldType } from "../src/CustomForm/Form";

describe("HeaderLine", () => {
  it("renders plain text title when href is absent", () => {
    const { container } = render(<HeaderLine title="main.bean:42" />);

    expect(container.querySelector(".panel-tag")).toHaveTextContent(
      "main.bean:42"
    );
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders title as a link when href is present", () => {
    render(
      <HeaderLine
        title="books/2024.bean:128"
        href="/repos/alice/ledger/blob/main/books/2024.bean#L128"
      />
    );

    const link = screen.getByRole("link", { name: "books/2024.bean:128" });
    expect(link).toHaveAttribute(
      "href",
      "/repos/alice/ledger/blob/main/books/2024.bean#L128"
    );
    expect(link.closest(".panel-tag")).not.toBeNull();
  });
});

describe("CustomForm header field", () => {
  const formProps = {
    files: [] as Array<string>,
    currencies: [] as Array<string>,
    accounts: [] as Array<string>,
    accountCurrencies: {},
    defaultDate: "2024-01-01",
  };

  it("passes href through to HeaderLine", () => {
    render(
      <Form
        {...formProps}
        fields={[
          {
            name: "header0",
            displayName: "books/2024.bean:128",
            type: FieldType.header,
            href: "/repos/alice/ledger/blob/main/books/2024.bean#L128",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("link", { name: "books/2024.bean:128" })
    ).toHaveAttribute(
      "href",
      "/repos/alice/ledger/blob/main/books/2024.bean#L128"
    );
  });

  it("keeps unlinked headers when href is omitted", () => {
    render(
      <Form
        {...formProps}
        fields={[
          {
            name: "header0",
            displayName: "main.bean:42",
            type: FieldType.header,
          },
        ]}
      />
    );

    expect(screen.getByText("main.bean:42")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
