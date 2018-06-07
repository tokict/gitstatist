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
import createTestObject from "../testDataCreator";
import moment from "moment";

test("commitProjects has a proper data object", () => {
  runTest("commits");
});

test("refactoringProjects has a proper data object", () => {
  runTest("refactoring");
});

test("newCodeProjects has a proper data object", () => {
  runTest("newCode");
});

test("commentsProjects has a proper data object", () => {
  runTest("comments");
});
test("testsProjects has a proper data object", () => {
  runTest("tests");
});

test("mergeRequestsProjects has a proper data object", () => {
  runTest("mergeRequests");
});

const runTest = type => {
  let one = new moment().subtract(1, "h");
  let two = new moment().subtract(2, "h");
  let data = createTestObject(type, one, two);

  const expectedLabel = "Project2";
  const expectedValue = [0, 0];

  let run;
  switch (type) {
    case "commits":
      run = commitsProjectsBar.generate(data);
      expectedValue[0] = 4;
      expectedValue[1] = 2;
      break;
    case "refactoring":
      run = refactoringProjectsBar.generate(data);
      expectedValue[0] = 12;
      expectedValue[1] = 6;
      break;
    case "newCode":
      run = newCodeProjectsBar.generate(data);
      expectedValue[0] = 8;
      expectedValue[1] = 4;
      break;
    case "tests":
      run = testsProjectsBar.generate(data);
      expectedValue[0] = 3;
      expectedValue[1] = 2;
      break;
    case "comments":
      run = commentsProjectsBar.generate(data);
      expectedValue[0] = 3;
      expectedValue[1] = 2;
      break;
    case "mergeRequests":
      run = mergeRequestsProjectsBar.generate(data);
      expectedValue[0] = 2;
      expectedValue[1] = 2;
      expectedValue[2] = 2;
      break;
  }
  expect(run.labels).toContain(expectedLabel);
  expect(run.datasets[0].data).toEqual(expectedValue);
};
