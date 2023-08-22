import { Request, Response, NextFunction, response } from "express";
import { errors } from "../../network";
import { AuthService } from "../../components/auth/services";
import { JwtPayload } from "jsonwebtoken";

class AuthMiddleware {
  private authService = new AuthService();
  constructor() {
    /* This vinculates the method 'checkToken' to AuthMiddleware instance */
    this.checkToken = this.checkToken.bind(this);
  }

  checkToken(req: Request, res: Response, next: NextFunction) {
    this.validaTokenFormat(req, res);

    // typing as a string here it's secure because previous function makes sure that 'authorization' contains valid string
    let token = this.transformToReadableToken(
      req.headers.authorization as string
    );
    let decodedToken = this.authService.verifyToken(token);
    this.isUserOwnerOfToken({
      res,
      decodedToken: decodedToken as JwtPayload,
      username: req.body.username,
    });

    next();
  }
  validaTokenFormat(req: Request, res: Response) {
    let token: string | undefined = req.headers.authorization;
    if (!token) {
      return errors({ res, message: "No token was found", status: 400 });
    } else if (token.indexOf("Bearer ") === -1) {
      return errors({ res, message: "Invalid token format", status: 400 });
    }
  }

  transformToReadableToken(rawToken: string) {
    let token = rawToken.replace("Bearer ", "");
    return token;
  }

  isUserOwnerOfToken({
    res,
    decodedToken,
    username,
  }: {
    res: Response;
    decodedToken: JwtPayload;
    username: string;
  }) {
    if (decodedToken.username != username) {
      //refactor this to avoid console.log about the error
      return errors({
        res,
        message: "You are not allowed to do this.",
        status: 400,
      });
    }
  }
}

export { AuthMiddleware };
