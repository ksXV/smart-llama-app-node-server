export type User = {
  email: string;
  name: string;
  id: number;
  entries: string;
  profilepic: string;
  joined: Date;
};
export type RegisterCredentials = {
  email: string;
  name: string;
  password: string;
};

export type LoginDB = {
  id: number;
  email: string;
  hash: string;
};
