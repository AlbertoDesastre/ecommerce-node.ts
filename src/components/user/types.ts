enum ErrorThrower {
  USER_ALREADY_EXISTS = "User already exists",
  USER_DOESNT_EXISTS = "This user doesn't exists.",
  USER_REMAIN_THE_SAME = "No update was made because the current information it's the same you provided",
  PASSWORD_NOT_MATCHING = "Password do not match",
  USER_UPDATING_DOESNT_EXISTS = "The user you are trying to update doesn't exists",
}

export { ErrorThrower };
