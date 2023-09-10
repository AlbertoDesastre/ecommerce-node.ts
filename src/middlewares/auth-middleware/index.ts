import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../components/auth/services";
import { errors } from "../../network";

class AuthMiddleware {
  private authService = new AuthService();
  constructor() {
    this.checkToken = this.checkToken.bind(this);
  }

  async checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      this.validaTokenFormat(req, res);

      let token = this.transformToReadableToken(
        req.headers.authorization as string
      );

      let decodedToken: any = this.authService.verifyToken(token);

      if (!decodedToken) {
        return errors({
          res,
          message: "Invalid token",
          status: 401,
        });
      }

      if (decodedToken.id !== req.params.id) {
        return errors({
          res,
          message: "You are not allowed to do this.",
          status: 403,
        });
      }

      next();
    } catch (error) {
      return errors({
        res,
        message: "Internal server error",
        status: 500,
      });
    }
  }

  validaTokenFormat(req: Request, res: Response) {
    let token: string | undefined = req.headers.authorization;
    if (!token) {
      return errors({
        res,
        message: "No token was found",
        status: 400,
      });
    } else if (!token.startsWith("Bearer ")) {
      return errors({
        res,
        message: "Invalid token format",
        status: 400,
      });
    }
  }

  transformToReadableToken(rawToken: string) {
    return rawToken.replace("Bearer ", "");
  }
}

export { AuthMiddleware };
