const mockList = jest.fn();
import request from "supertest";
import { Express } from "express";
import { success, errors } from "../network";
import http from "http";
import { app } from "..";

jest.mock("../../src/store/mysql", () => ({
  handleConnection: () => ({
    list: mockList,
    getOne: () => {},
  }),
}));

describe("Test for products endpoint", () => {
  let expressApp: Express;
  /* It's very curious that the method to close a connection/server it's owned by HTTP and not Express */
  let server: http.Server;

  beforeAll(() => {
    expressApp = app;
    server = app.listen(3001);
  });
  afterAll(async () => {
    await server.close();
  });
  /* My first test e2e it's working!! */
  describe("test for [GET] /api/v1/products/", () => {
    test("should return 'GOODBYE!!' ", async () => {
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
        .then((body: any) => {
          //Assert
          expect(body.data.length).toEqual(1);
        });
    });
  });
});
