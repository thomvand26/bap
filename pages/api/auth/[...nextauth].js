import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { login, register } from 'server/utils';
import bcrypt from 'bcrypt';
import { User } from 'models/User';

export default NextAuth({
  providers: [
    Providers.Credentials({
      id: 'email-password',
      name: 'email & password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'john@mail.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
        username: {
          label: 'Username',
          type: 'text',
        },
      },
      authorize: async (credentials) => {
        const {
          email,
          password: plainPassword,
          username,
          locale,
        } = credentials;

        const password = await new Promise((resolve, reject) => {
          bcrypt.hash(
            plainPassword,
            parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
            (err, hash) => {
              if (err) reject(err);
              resolve(hash);
            }
          );
        });

        const loginResponse = username
          ? await register({ email, password, username, locale })
          : await login({ email, password: plainPassword, locale });

        if (loginResponse?.success) {
          return loginResponse.user;
        } else {
          throw new Error(new URLSearchParams(loginResponse?.error).toString());
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    jwt: async (token, user) => {
      let userData = user;
      if (!user) {
        userData = await User.findOne({ email: token?.email });
      }

      if (userData) {
        return { ...token, user: userData };
      }

      return token;
    },
    session: async (session, token) => {
      if (token?.user) {
        const { _id, email, username, createdAt, updatedAt } = token.user;
        session.user = { _id, email, username, createdAt, updatedAt };
      }
      session.token = token;

      delete session.token.user;

      return Promise.resolve(session);
    },
  },
  database: process.env.DB_CONNECTION_STRING,
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.JWT_SECRET,
});
