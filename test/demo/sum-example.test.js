const { add } = require('./sum-example');

test('adds 1 + 2', () => {
  expect(add(1, 2)).toBe(3);
});
