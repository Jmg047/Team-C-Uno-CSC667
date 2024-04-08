import * as UsersDB from "../../db/db_users";
import HttpCode from "../../utilities/http_code";
import bcrypt from "bcryptjs";

const logIn = async (req, res) => {
  const { username, password } = req.body;

  if (req.session.user !== undefined) {
    return res.status(HttpCode.BadRequest).json({
      error: "You are already logged in as: " + req.session.user.username,
    });
  }

  try {
    const userExists = await UsersDB.foundUser(username);

    if (!userExists) {
      return res
        .status(HttpCode.BadRequest)
        .json({ error: username + " does not exist" });
    }

    const user = await UsersDB.getUser(username);
    const isPasswordSame = await bcrypt.compare(password, user.password);

    if (isPasswordSame) {
      req.session.user = {
        id: user.id,
        username: user.username,
      };

      return res
        .status(HttpCode.OK)
        .json({ message: username + " is logged in" });
    } else {
      return res
        .status(HttpCode.Forbidden)
        .json({ error: "Invalid username/password" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(HttpCode.InternalServerError)
      .json({ error: "Internal server error" });
  }
};

export { logIn };