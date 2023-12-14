import path from "path";
import url from "url";
import bcrypt, { hashSync } from "bcrypt";
const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const createHash = (password) => {
  const result = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  return result;
};

export const isValidPassword = (password, user) => {
  const result = bcrypt.compareSync(password, user.password);
  return result;
};
