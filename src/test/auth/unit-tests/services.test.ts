import { AuthService } from "../../../components/auth/services";

describe("Test for authentication service", () => {
  let authService = new AuthService();

  describe("test for [ENCRYPT PASSWORD]", () => {
    // Arrange
    beforeEach(async () => {});
    afterEach(async () => {});

    test("authService should encrypt a password when a string it's provided ", async () => {
      const password = "testPassword";
      const hashedPassword = await authService.encryptPassword({ password });

      // Asegúrate de que hashedPassword sea un hash válido
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword.length).toBeGreaterThan(15);
      expect(hashedPassword).toHaveLength(60);
    });
  });
});
