const mockList = jest.fn();
const mockGetOne = jest.fn();
const handleConnectionMock = {
  list: mockList,
  getOne: mockGetOne,
};
const mysqlStoreMock = jest.requireActual("../store/mysql");
const handleConnection = jest.fn().mockReturnValue(handleConnectionMock);
mysqlStoreMock.handleConnection = handleConnection;
import request from "supertest";
import { Express } from "express";
import http from "http";
import { app } from "../../app";

/* When calling the real mysqlStore, it will get substitute by "mysqlStoreMock". Now something really interesting happens here...
The product service calls "mysqlStoreMock" that contains the function "handleConnection", exactly the same name the real module has.
If you changed "handleConnection" name that's getting assigned on line 10, jest will try to Mock the Module, and when trying to access
the method "handleConnection" it will fail. Jest needs the exact name the Product Service it's using in real cases, otherwises, it will fail.

In fact, you could change the const in line 9 to whatever name you want and it will still work. The magic is happening in line 10, when the mock is getting
assigned "handleConnection" with a the mocked function.*/
jest.mock("../store/mysql", () => mysqlStoreMock);

describe("Test for products endpoint", () => {
  let expressApp: Express;
  /* It's very curious that the method to close a connection/server it's owned by HTTP and not Express */
  let server: http.Server;

  beforeAll(() => {
    expressApp = app;
    server = app.listen(3002);
  });
  afterAll(() => {
    server.close();
  });
  /* My first test e2e it's working!! */
  describe("test for [GET] /api/v1/products/", () => {
    test("should return an array with an object' ", async () => {
      //Arrange
      const sampleProduct = [
        {
          id: 11,
          category_id: 3,
          name: "Nintendo Switch",
          description:
            "Versatile gaming console for both handheld and TV gaming.",
          color: "Neon Red/Neon Blue",
          price: 127,
          quantity: 90,
          image: "",
          active: 1,
          created_at: "2023-07-09T18:57:14.000Z",
        },
      ];
      mockList.mockReturnValue(sampleProduct);

      //Act
      return await request(app)
        .get("/api/v1/products/")
        .expect(200)
        .then((response: request.Response) => {
          const responseBody = JSON.parse(response.text);

          //Assert
          expect(responseBody.body.length).toEqual(1);
        });
    });
  });
});
