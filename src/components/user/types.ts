type BasicUser = {
  username: string;
  email: string;
  password: string;
};

interface User extends BasicUser {
  id: string;
  avatar: string | null;
  token: string;
  created_at: Date;
}

export { User, BasicUser };
