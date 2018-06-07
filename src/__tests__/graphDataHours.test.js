import * as commitsTimeline from "../graph/commits/timeline";
import * as commitsHours from "../graph/commits/hours";
import * as commitsDays from "../graph/commits/days";
import * as commitsProjectsBar from "../graph/commits/projects";
import * as commitsBranchesBar from "../graph/commits/branches";
import * as refactoringProjectsBar from "../graph/refactoring/projects";
import * as refactoringBranchesBar from "../graph/refactoring/branches";
import * as refactoringTimeline from "../graph/refactoring/timeline";
import * as newCodeProjectsBar from "../graph/newCode/projects";
import * as newCodeBranchesBar from "../graph/newCode/branches";
import * as newCodeTimeline from "../graph/newCode/timeline";
import * as commentsTimeline from "../graph/comments/timeline";
import * as commentsHours from "../graph/comments/hours";
import * as commentsDays from "../graph/comments/days";
import * as commentsProjectsBar from "../graph/comments/projects";
import * as commentsBranchesBar from "../graph/comments/branches";
import * as mergeRequestsProjectsBar from "../graph/mergeRequests/projects";
import * as mergeRequestsBranchesBar from "../graph/mergeRequests/branches";
import * as mergeRequestsTimeline from "../graph/mergeRequests/timeline";
import * as testsTimeline from "../graph/tests/timeline";
import * as testsHours from "../graph/tests/hours";
import * as testsDays from "../graph/tests/days";
import * as testsProjectsBar from "../graph/tests/projects";
import * as testsBranchesBar from "../graph/tests/branches";
import createTestObject from "../graphTestDataCreator";
import moment from "moment";

test("commitHours has a proper data object", () => {
  runTest("commits");
});

test("commentsHours has a proper data object", () => {
  runTest("comments");
});

test("testHours graph has a proper data object", () => {
  runTest("tests");
});

const runTest = type => {
  let one = new moment().subtract(1, "h");
  let two = new moment().subtract(2, "h");
  let data = createTestObject(type, one, two);

  const expectedLabel = one.format("k") + ":00";
  const expectedValue = [];

  let hr;
  for (let i = 0; i < 24; i++) {
    expectedValue.push(0);
  }

  let run;
  switch (type) {
    case "commits":
      run = commitsHours.generate(data);
      expectedValue[one.format("k")] = 3;
      expectedValue[two.format("k")] = 3;
      break;
    case "comments":
      run = commentsHours.generate(data);
      expectedValue[one.format("k")] = 2;
      expectedValue[two.format("k")] = 3;
      break;
    case "tests":
      run = testsHours.generate(data);
      expectedValue[one.format("k")] = 2;
      expectedValue[two.format("k")] = 3;
      break;
  }
  expect(run.labels).toContain(expectedLabel);
  expect(run.datasets[0].data).toEqual(expectedValue);
};
