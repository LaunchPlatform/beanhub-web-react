import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import DiffPreview from "../../src/Shared/DiffPreview";

export default {
  component: DiffPreview,
} as ComponentMeta<typeof DiffPreview>;

const original = [
  '2022-03-02 * "Jane Doe" "Coffee"',
  "  Assets:Cash     -5 USD",
  "  Expenses:Food    5 USD",
].join("\n");

const updated = [
  '2022-03-02 * "Jane Doe" "Morning coffee"',
  "  Assets:Cash     -6 USD",
  "  Expenses:Food    6 USD",
].join("\n");

export const PreviewOnly: ComponentStory<typeof DiffPreview> = () => (
  <DiffPreview updated={updated} />
);

export const WithDiff: ComponentStory<typeof DiffPreview> = () => (
  <DiffPreview original={original} updated={updated} />
);

export const Unchanged: ComponentStory<typeof DiffPreview> = () => (
  <DiffPreview original={original} updated={original} />
);

const spacedOriginal = [
  '2026-06-12 * "Uber"',
  "  Liabilities:CreditCard:US:ChaseSapphirePreferred           -5.40 USD",
  "  Expenses:Travel                                             5.40 USD",
].join("\n");

const compactUpdated = [
  '2026-06-12 * "Uber"',
  "  Liabilities:CreditCard:US:ChaseSapphirePreferred -5.40 USD",
  "  Expenses:Travel                                   5.40 USD",
].join("\n");

/** Spacing-only differences should not appear as add/remove. */
export const SpacingOnly: ComponentStory<typeof DiffPreview> = () => (
  <DiffPreview original={spacedOriginal} updated={compactUpdated} />
);

/** Character-level marks inside paired remove/add lines. */
export const InlineCharHighlight: ComponentStory<typeof DiffPreview> = () => (
  <DiffPreview
    original={[
      '2026-04-26 * "Uber"',
      "  Liabilities:CreditCard:US:ChaseSapphirePreferred  -6.33 USD",
      "  Expenses:Travel                                   6.33 USD",
    ].join("\n")}
    updated={[
      '2026-04-26 ! "asdf" "Uber"',
      "  Liabilities:CreditCard:US:ChaseSapphirePreferred  -6.34 USD",
      "  Expenses:Travel                                   6.34 USD",
    ].join("\n")}
  />
);
