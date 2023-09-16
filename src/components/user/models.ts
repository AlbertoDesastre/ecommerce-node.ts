type BasicUser = {
  username: string;
  email: string;
  password: string;
};

interface BasicUserWithId extends BasicUser {
  id: string;
}

interface User extends BasicUser {
  id: string;
  avatar: string | null;
  token?: string;
  created_at: Date | null;
}

enum TableColumns {
  USERS_POST_VALUES = "(id, username, email, password, avatar, created_at)",
  USERS_GET_ID = "username",
  USERS_GET_PARTIAL_VALUES = "username, email, avatar",
  USERS_GET_VALUES = "id, username, email, password, avatar, created_at",
}

export { User, BasicUser, BasicUserWithId, TableColumns };
