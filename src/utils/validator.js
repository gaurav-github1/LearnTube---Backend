import validator from "validator";

/**
 * Validates if the input is a non-empty string
 * @param {string} value - The value to check
 * @returns {boolean} - True if value is not empty after trimming
 */
export const isNonEmptyString = (value) => {
  if (!value) return false;
  return value.trim() !== "";
};

/**
 * Validates if all required fields are provided
 * @param {Object} fields - Object containing fields to validate
 * @returns {boolean} - True if all fields are non-empty
 */
export const areRequiredFieldsProvided = (fields = []) => {
  return !fields.some((field) => !isNonEmptyString(field));
};

/**
 * Validates if the email is valid
 * @param {string} email - The email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validates if the password is strong
 * @param {string} password - The password to validate
 * @returns {boolean} - True if password is strong
 */
export const isStrongPassword = (password) => {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  });
}; 