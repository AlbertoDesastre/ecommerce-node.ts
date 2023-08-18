type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  token: string;
  created_at: Date;
};

export { User };
