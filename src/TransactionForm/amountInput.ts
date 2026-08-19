/**
 * Amount fields use type="text" so typing "-1" is not dropped by HTML
 * number inputs. Restrict values to a number-in-progress (sign, digits,
 * optional thousands commas, optional decimal).
 */
export function isPlainAmountInput(value: string): boolean {
  return /^[-+]?[\d,]*\.?\d*$/.test(value);
}
