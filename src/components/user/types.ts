enum ErrorThrower {
  USER_ALREADY_EXISTS = "User already exists",
  USER_DOESNT_EXISTS = "This user doesn't exists.",
  USER_REMAIN_THE_SAME = "No update was made because the current information it's the same you provided",
  PASSWORD_NOT_MATCHING = "Password do not match",
  USER_UPDATING_DOESNT_EXISTS = "The user you are trying to update doesn't exists",
  CONTROLLER_DONT_PROVIDE_USERNAME_AND_EMAIL = "You can't login without providing an username or email",
  CONTROLLER_ONLY_ONE_PARAMETER_ACCEPTED = "You can only do a login with a username or an email, but not both",
  CONTROLLER_NO_PASSWORD_PASSED = "No password was provided",
}

export { ErrorThrower };
