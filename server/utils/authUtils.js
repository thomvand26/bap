import { User } from '../../models';
import bcrypt from 'bcrypt';
import { sendWelcomeEmail } from './emailUtils';

export const login = async ({ email, password, locale }) => {
  const user = await User.findOne({ email });

  try {
    if (!user) {
      throw {
        message:
          locale === 'en'
            ? 'This email has no account yet.'
            : 'Dit e-mailadres heeft nog geen account.',
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
        message: locale === 'en' ? 'Invalid password.' : 'Ongeldig wachtwoord.',
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
        message:
          locale === 'en'
            ? 'Could not register new user.'
            : 'Kon geen nieuwe gebruiker registreren.',
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
          error: {
            message:
              locale === 'en'
                ? 'This email is already in use.'
                : 'Dit e-mailadres is al in gebruik.',
            field: 'email',
          },
        };
      } else if (error.message.includes(' dup key: { username: ')) {
        return {
          success: false,
          error: {
            message:
              locale === 'en'
                ? 'This username is already in use.'
                : 'Deze gebruikersnaam is al in gebruik.',
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
