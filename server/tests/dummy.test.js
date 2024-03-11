const { dummy } = require("../utils/list_helper");

test("dummy return 1", () => {
  const blogs = [];

  expect(dummy(blogs)).toBe(1);
});
