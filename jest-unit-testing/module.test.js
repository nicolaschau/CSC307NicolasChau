// module.test.js
import mut from "./module.js"; // MUT = Module Under Test

test("Testing div -- success", () => {
  const expected = 4;
  const got = mut.div(20, 5);
  expect(got).toBe(expected);
});

test("Testing div -- failure", () => {
  const expected = 6;
  const got = mut.div(20, 5);
  expect(got).not.toBe(expected);
});

test("Testing div -- division by zero", () => {
  const got = mut.div(20, 0);
  expect(got).toBe(Infinity);
});

test("Testing div -- negative numbers", () => {
  const expected = -4;
  const got = mut.div(-20, 5);
  expect(got).toBe(expected);
});

test("Testing div -- both negative numbers", () => {
  const expected = 4;
  const got = mut.div(-20, -5);
  expect(got).toBe(expected);
});

test("Testing containsNumbers -- success", () => {
  const text = "Hello123";
  const got = mut.containsNumbers(text);
  expect(got).toBe(true);
});

test("Testing containsNumbers -- failure", () => {
  const text = "HelloWorld";
  const got = mut.containsNumbers(text);
  expect(got).toBe(false);
});

test("Testing containsNumbers -- empty string", () => {
  const text = "";
  const got = mut.containsNumbers(text);
  expect(got).toBe(false);
});

test("Testing containsNumbers -- only numbers", () => {
  const text = "123456";
  const got = mut.containsNumbers(text);
  expect(got).toBe(true);
});

test("Testing containsNumbers -- special characters", () => {
  const text = "Hello@2024!";
  const got = mut.containsNumbers(text);
  expect(got).toBe(true);
});

test("Testing containsSpaces -- only spaces", () => {
  const text = "     ";
  const got = mut.containsNumbers(text);
  expect(got).toBe(false);
});
