import validator from "validator";

export const registerValidation = (value) => {
 
  const { first_name, last_name, emailId, password } = value;
  if (!first_name || !last_name) {
    throw new Error("First name or Last name was/were not entered.");
  } else if (first_name.length < 2 || last_name < 2) {
    throw new Error("Your name must be at least 2 letters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("This is not a valid email format.");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("This is not a strong password format.");
  }
};
