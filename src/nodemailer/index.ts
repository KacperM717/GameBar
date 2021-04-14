import { createTransport } from 'nodemailer';
import {
  EMAIL_PASS,
  EMAIL_USER,
  EMAIL_HOST,
  EMAIL_SERVICE,
} from '../util/secrets';
import { IAuthEmailData } from './types';

const emailer = createTransport({
  service: EMAIL_SERVICE,
  host: EMAIL_HOST,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendVerification = async (data: IAuthEmailData) => {
  return await emailer.sendMail({
    to: data.recipients,
    from: data.sender ? data.sender : EMAIL_USER,
    subject: 'APP_NAME - Confirm your email address',
    html: `
      <h1>Welcome to app_name!</h1>
      <p>Please click link below to activate your account:</p>
      <p>${data.authLink}</p>
    `,
  });
};

const sendPasswordChange = async (data: IAuthEmailData) => {
  return await emailer.sendMail({
    to: data.recipients,
    from: data.sender ? data.sender : EMAIL_USER,
    subject: 'APP_NAME - Reset your password',
    html: `
      <h1>Welcome to app_name!</h1>
      <p>Please click link below to reset your password:</p>
      <p>${data.authLink}</p>
    `,
  });
};

export default emailer;

export { sendVerification, sendPasswordChange };
