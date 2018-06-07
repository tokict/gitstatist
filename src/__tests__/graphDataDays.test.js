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

test("commitDays has a proper data object", () => {
  runTest("commits");
});

test("commentsDays has a proper data object", () => {
  runTest("comments");
});

test("testDays graph has a proper data object", () => {
  runTest("tests");
});

const runTest = type => {
  let one = new moment();
  let two = new moment().subtract(1, "days");

  let data = createTestObject(one, two);
  const expectedLabel = one.format("dddd");

  const d = {};

  let labels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  labels.forEach(item => (d[item] = 0));

  let run;
  switch (type) {
    case "commits":
      run = commitsDays.generate(data);
      d[one.format("dddd")] = 3;
      d[two.format("dddd")] = 3;

      break;
    case "comments":
      run = commentsDays.generate(data);
      d[one.format("dddd")] = 2;
      d[two.format("dddd")] = 3;
      break;
    case "tests":
      run = testsDays.generate(data);
      d[one.format("dddd")] = 2;
      d[two.format("dddd")] = 3;
      break;
  }
  expect(run.labels).toContain(expectedLabel);
  expect(run.datasets[0].data).toEqual(Object.values(d));
};
