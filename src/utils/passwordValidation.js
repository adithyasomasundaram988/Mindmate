/**
 * Shared Password Validation Utility for Mindmate
 * Enforces the 5 strict security requirements across Registration, Reset, and Change Password:
 * 1. Minimum 8 characters.
 * 2. At least one uppercase English letter.
 * 3. At least one lowercase English letter.
 * 4. At least one number.
 * 5. At least one special character.
 */

export const PASSWORD_RULES = [
  { id: 'min_length', label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { id: 'uppercase', label: 'At least one uppercase letter (A-Z)', test: (pwd) => /[A-Z]/.test(pwd) },
  { id: 'lowercase', label: 'At least one lowercase letter (a-z)', test: (pwd) => /[a-z]/.test(pwd) },
  { id: 'number', label: 'At least one number (0-9)', test: (pwd) => /[0-9]/.test(pwd) },
  { id: 'special', label: 'At least one special character (!@#$%^&*...)', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
];

export function validatePassword(password = '') {
  const checks = {
    min_length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isValid = Object.values(checks).every(Boolean);
  const score = Object.values(checks).filter(Boolean).length;

  let strength = 'Weak';
  if (score >= 5) strength = 'Strong';
  else if (score >= 3) strength = 'Moderate';

  return {
    isValid,
    score,
    strength,
    checks,
  };
}
