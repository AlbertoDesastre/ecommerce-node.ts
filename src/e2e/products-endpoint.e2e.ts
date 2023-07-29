const mockList = jest.fn();
const mockGetOne = jest.fn();
const handleConnectionMock = {
  list: mockList,
  getOne: mockGetOne,
};
/* The 3 following lines were added just now. I have absolutely no idea why it's working now */
const mysqlStore = jest.requireActual("../store/mysql");
const handleConnection = jest.fn().mockReturnValue(handleConnectionMock);
mysqlStore.handleConnection = handleConnection;
import request from "supertest";
import { Express } from "express";
import http from "http";
import { app } from "..";

jest.mock("../store/mysql", () => mysqlStore);

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
      mockList.mockReturnValue([
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
      ]);
      //Act
      return await request(app)
        .get("/api/v1/products/")
        .expect(200)
        .then((response: any) => {
          //Assert
          expect(JSON.parse(response.text).body.length).toEqual(1);
        });
    });
  });
});
