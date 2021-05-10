export type Login = {
  email: string;
  password: string;
};

export type Register = {
  name: string;
  email: string;
  password: string;
};

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  password: string;
  walletAddr: string;
  profileImgUrl: string;
  subcribedCategories: number[];
};
