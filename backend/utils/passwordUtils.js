import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};



export function generateTemporaryPassword() {
  // Generate a random string for the temporary password
  // You can use any method to generate a random string, for example:
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 10;
  let temporaryPassword = "";
  for (let i = 0; i < length; i++) {
    temporaryPassword += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return temporaryPassword;
}


// (async () => {
//   const plainTextPassword = req.body.password;
//   const hashedPassword = await hashPassword(plainTextPassword);
//   const isMatch = await comparePassword(plainTextPassword, user.password);
//   console.log(isMatch); // This should now be true
// })();