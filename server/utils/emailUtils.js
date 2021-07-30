import { renderToStaticMarkup } from 'react-dom/server';
import nodemailer from 'nodemailer';

import { GoodbyeEmail, WelcomeEmail } from '../../emails/';

const initNodemailer = async () => {
  return nodemailer.createTransport({
    host: 'cloudemail.be',
    port: 465,
    secure: true,
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.COMPANY_EMAIL_PASSWORD,
    },
  });
};

export const sendWelcomeEmail = async (user, locale = 'nl') => {
  if (!user?.email) throw new Error('No user');

  const transporter = await initNodemailer();

  return await transporter.sendMail({
    from: 'info@roomstage.be',
    to: user.email,
    subject:
      locale === 'en'
        ? `Welcome ${user.username}!`
        : `Welkom ${user.username}!`,
    text:
      locale === 'en'
        ? `Welcome ${user.username}! You can now participate in shows, or create one yourself.`
        : `Welkom ${user.username}! Je kan nu deelnemen aan shows, of er zelf een aanmaken.`,
    html: renderToStaticMarkup(<WelcomeEmail user={user} locale={locale} />),
  });
};

export const sendGoodbyeEmail = async (user, locale = 'nl') => {
  const transporter = await initNodemailer();

  return await transporter.sendMail({
    from: 'info@roomstage.be',
    to: user.email,
    subject: locale === 'en' ? `Account deleted` : `Account verwijderd`,
    text:
      locale === 'en'
        ? `Your account has been successfully deleted. You can always create a new account.`
        : `Account verwijderd. Jouw account is succesvol verwijderd. Je kan altijd een nieuw account aanmaken.`,
    html: renderToStaticMarkup(<GoodbyeEmail locale={locale} />),
  });
};
