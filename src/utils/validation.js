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
                                          // value is an object data User entered composed of items to be edited. 
export const validateEditProfileData = (value) => {
  const allowedEditFields = [
    "first_name",
    "last_name",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(value).every((field) => 
   allowedEditFields.includes(field)
  );
  
return isEditAllowed;
};
