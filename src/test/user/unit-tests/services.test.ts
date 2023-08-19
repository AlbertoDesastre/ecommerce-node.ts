const mockHandleConnection = jest.fn();
const mockSqlGetOne = jest.fn();
const mockSqlList = jest.fn();
const mockSqlFilterBy = jest.fn();
const mockSqlCreate = jest.fn();
const mockSqlUpdate = jest.fn();
const mockSqlToggleItemStatus = jest.fn();
const mockSqlEliminate = jest.fn();

jest.mock("../../../store/mysql", () => {
  return {
    handleConnection: mockHandleConnection.mockReturnValue({
      getOne: mockSqlGetOne,
      list: mockSqlList,
      filterBy: mockSqlFilterBy,
      create: mockSqlCreate,
      update: mockSqlUpdate,
      toggleItemStatus: mockSqlToggleItemStatus,
      eliminate: mockSqlEliminate,
    }),
  };
});

const mockControllerGet = jest.fn();
const mockControllerRegister = jest.fn();
const mockControllerUpdate = jest.fn();
const mockControllerEliminate = jest.fn();

jest.mock("../../../components/user/controllers", () => {
  return {
    get: mockControllerGet,
    register: mockControllerRegister,
    update: mockControllerUpdate,
    eliminate: mockControllerEliminate,
  };
});

import * as userController from "../../../components/user/controllers";
import { AuthService } from "../../../components/auth/services";
import { Request, Response } from "express";
import { handleConnection } from "../../../store/mysql";
import { ConnectionMethods } from "../../../store/types";

describe("test for User Service ", () => {
  let userControllerRegisterSpy: jest.SpyInstance;
  let userServiceSpy: jest.SpyInstance;
  let authService: AuthService;
  let authServiceSpy: jest.SpyInstance;
  let request: Request;
  let response: Response;
  let connection: ConnectionMethods;
  beforeAll(() => {
    connection = handleConnection();
    userControllerRegisterSpy = jest.spyOn(userController, "register");
    authService = new AuthService();
  });
  beforeEach(() => {
    userServiceSpy = jest.spyOn(authService, "register");
    jest.clearAllMocks();
  });

  /*RECORDAR, TENGO QUE CERRAR LA CONEXIÓN Y ADEMÁS ENCONTRAR UNA MANERA DE NO TENER QUE REPETIR EL MOCK DE HANDLECONNECTION CONSTANTEMENTE  */
  describe("service calling [register]", () => {
    test("should return the same object that received from controller", () => {
      /*       expect(authService.register).toBeCalledWith({}); */
    });
  });
});
