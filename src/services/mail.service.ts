import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import {
  EMAIL_PASS,
  EMAIL_USER,
  EMAIL_HOST,
  EMAIL_SERVICE,
} from '../config';
import { IAuthEmailData } from '../types';

// Default emailer options
export const options = {
  host: EMAIL_HOST,
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
};

export class EmailerService {
  emailer: Mail;
  defaultUser: string;
  constructor(options: any, defaultUser: string) {
    this.emailer = createTransport(options);
    this.defaultUser = defaultUser;
  }

  sendVerification = async (data: IAuthEmailData) => {
    return await this.emailer.sendMail({
      to: data.recipients,
      from: data.sender ? data.sender : this.defaultUser,
      subject: 'GamePub - Confirm your email address',
      html: `
      <h1>Welcome to GamePub!</h1>
      <p>Please, take a seat and click link below to activate your account:</p>
      <a href="${data.authLink}">Activate Account</a>
    `,
    });
  };

  sendPasswordChange = async (data: IAuthEmailData) => {
    return await this.emailer.sendMail({
      to: data.recipients,
      from: data.sender ? data.sender : this.defaultUser,
      subject: 'GamePub - Reset your password',
      html: `
      <h1>Welcome to GamePub!</h1>
      <p>Please click link below to reset your password:</p>
      <a href="${data.authLink}">Reset Password</a>e
    `,
    });
  };
}

// Default EmailService
const emailer = new EmailerService(options, EMAIL_USER);

export default emailer;
