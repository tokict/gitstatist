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

test("commitBranches has a proper data object", () => {
  runTest("commits");
});

test("refactoringBranches has a proper data object", () => {
  runTest("refactoring");
});

test("newCodeBranches has a proper data object", () => {
  runTest("newCode");
});

test("commentsBranches has a proper data object", () => {
  runTest("comments");
});
test("testsBranches has a proper data object", () => {
  runTest("tests");
});

test("mergeRequestsBranches has a proper data object", () => {
  runTest("mergeRequests");
});

const runTest = type => {
  let one = new moment().subtract(1, "h");
  let two = new moment().subtract(2, "h");
  let data = createTestObject(one, two);

  let expectedLabel = "Project3 -> dev";
  let expectedValue = [];

  let run;
  switch (type) {
    case "commits":
      run = commitsBranchesBar.generate(data);
      expectedLabel = "Project2 -> dev";
      expectedValue = [3, 2, 1];
      break;
    case "refactoring":
      run = refactoringBranchesBar.generate(data);
      expectedValue = [4, 3, 2, 0, 0];

      break;
    case "newCode":
      run = newCodeBranchesBar.generate(data);
      expectedValue = [4, 3, 2, 0, 0];

      break;
    case "tests":
      run = testsBranchesBar.generate(data);
      expectedLabel = "Project1 -> dev";
      expectedValue[0] = 3;
      expectedValue[1] = 2;
      break;
    case "comments":
      run = commentsBranchesBar.generate(data);
      expectedLabel = "Project2 -> master";
      expectedValue[0] = 3;
      expectedValue[1] = 2;
      break;
    case "mergeRequests":
      run = mergeRequestsBranchesBar.generate(data);
      expectedValue = [1, 1, 1];
      break;
  }
  expect(run.labels).toContain(expectedLabel);
  expect(run.datasets[0].data).toEqual(expectedValue);
};
