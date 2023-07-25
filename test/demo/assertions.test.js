// matchers | assertions in other documentations
test('testing objects', () => {
  const data = { name: 'pepe' };
  data.lastname = 'perez';
  expect(data).toEqual({ name: 'pepe', lastname: 'perez' });
});

test('testing nulls', () => {
  const data = null;
  expect(data).toBeNull();
  expect(data).toBeDefined(); //null are expected to be DEFINED and empty, unlike undefined
  expect(data).not.toBeUndefined();
});

test('booleans', () => {
  expect(true).toEqual(true);
  expect(false).toEqual(false);

  expect(0).toBeFalsy();
  expect('').toBeFalsy();
  expect(false).toBeFalsy();
});

test('string', () => {
  expect('Christoph').toMatch(/stop/); // the way of saying "includes this string"
});

test('list / arrays', () => {
  const numbers = [1, 2, 3, 4];
  expect(numbers).toContain(3);
});
