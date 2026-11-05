/**
 * Password policy shared by the registration form (live checklist) and the
 * submit guard, so what the user sees and what gets submitted never drift.
 *
 * Criteria (assignment requirement):
 *  · at least one UPPERCASE letter
 *  · at least one lowercase letter
 *  · at least 6 characters
 */

export type PasswordRule = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "upper",
    label: "At least one uppercase letter (A–Z)",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lower",
    label: "At least one lowercase letter (a–z)",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "length",
    label: "At least 6 characters long",
    test: (value) => value.length >= 6,
  },
];

/** Returns the labels of every rule that still fails (empty = valid). */
export function passwordViolations(value: string): string[] {
  return PASSWORD_RULES.filter((rule) => !rule.test(value)).map(
    (rule) => rule.label,
  );
}

/** 0–3 score, handy for the segmented strength meter. */
export function passwordStrength(value: string): number {
  return PASSWORD_RULES.filter((rule) => rule.test(value)).length;
}
