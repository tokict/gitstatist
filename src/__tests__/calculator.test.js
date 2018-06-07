import * as calculator from "../calculator";
import createTestObject from "../graphTestDataCreator";
import moment from "moment";

test("calculator calculates", () => {
  let one = new moment().subtract(1, "h");
  let two = new moment().subtract(2, "h");

  const data = createTestObject(one, two);
  const users = Object.values(data.users);

  const commits = calculator.commits(users);

  const refactoring = calculator.refactoring(users, data.commits.details);

  const newCode = calculator.newCode(users, data.commits.details);

  const comments = calculator.comments(users);

  const mergeRequests = calculator.mergeRequests(users);

  const tests = calculator.failedTests(users, data.commits.details);
});
