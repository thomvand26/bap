import { User } from '../../models';
import bcrypt from 'bcrypt';
import { sendWelcomeEmail } from './emailUtils';

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  try {
    if (!user) {
      throw {
        message: 'This email has no account yet.',
        field: 'email',
      };
    }

    const isValid = await new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });

    if (!isValid)
      throw {
        message: 'Invalid password.',
        field: 'password',
      };

    return { success: true, user };
  } catch (error) {
    // console.log(error);
    return {
      success: false,
      error: error || { message: error.message, field: 'email' },
    };
  }
};

export const register = async ({ email, password, username, locale }) => {
  try {
    const user = await User.create({ email, password, username });

    if (!user) {
      throw {
        message: 'Could not register new user.',
        field: 'email',
      };
    }

    await sendWelcomeEmail(user, locale);

    return { success: true, user };
  } catch (error) {
    // console.log(error);
    if (error.message.includes('E11000')) {
      if (error.message.includes(' dup key: { email: ')) {
        return {
          success: false,
          error: { message: 'This email is already in use.', field: 'email' },
        };
      } else if (error.message.includes(' dup key: { username: ')) {
        return {
          success: false,
          error: {
            message: 'This username is already in use.',
            field: 'username',
          },
        };
      }
    }
    return {
      success: false,
      error: error || { message: error.message, field: 'email' },
    };
  }
};
