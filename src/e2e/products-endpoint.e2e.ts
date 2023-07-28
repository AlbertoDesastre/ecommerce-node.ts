import request from "supertest";
import { Application, Express } from "express";
import http from "http";
import { app } from "..";

describe("Test for goodbye endpoint", () => {
  let expressApp: Express;
  /* It's very curious that the method to close a connection/server it's owned by HTTP and not Express */
  let server: http.Server;

  beforeAll(() => {
    expressApp = app;
    server = app.listen(3001);
  });
  afterAll(() => {
    server.close();
  });
  /* My first test e2e it's working!! */
  describe("test for [GET] /goodbye", () => {
    test("should return 'GOODBYE!!' ", () => {
      return request(app)
        .get("/goodbye")
        .expect("GOODBYE!!")
        .then((response) => {
          expect(response.text).toEqual("GOODBYE!!");
        });
    });
  });
});
