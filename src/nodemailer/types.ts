export interface IEmailData {
  sender?: string;
  recipients: string[];
}

export interface IAuthEmailData extends IEmailData {
  authLink: string;
}
