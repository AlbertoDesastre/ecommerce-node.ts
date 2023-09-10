import * as userController from "../../../components/user/controllers";
import { AuthService } from "../../../components/auth/services";
import { Request, Response } from "express";
import { handleConnection } from "../../../store/mysql";
import { ConnectionMethods } from "../../../store/types";

describe("test for User Service ", () => {
  let userControllerRegisterSpy: jest.SpyInstance;
  let authService: AuthService;
  let connection: ConnectionMethods;
  beforeAll(() => {
    connection = handleConnection();
    userControllerRegisterSpy = jest.spyOn(userController, "register");
    authService = new AuthService();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /*RECORDAR, TENGO QUE CERRAR LA CONEXIÓN Y ADEMÁS ENCONTRAR UNA MANERA DE NO TENER QUE REPETIR EL MOCK DE HANDLECONNECTION CONSTANTEMENTE  */
  describe("service calling [register]", () => {
    test("should return the same object that received from controller", () => {
      /*       expect(authService.register).toBeCalledWith({}); */
    });
  });
});
