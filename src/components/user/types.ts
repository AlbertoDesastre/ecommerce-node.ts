type BasicUser = {
  username: string;
  email: string;
  password: string;
};

interface UserWithId extends BasicUser {
  id: string;
}

interface User extends BasicUser {
  id: string;
  avatar: string | null;
  token?: string;
  created_at: Date | null;
}

export { User, BasicUser, UserWithId };
