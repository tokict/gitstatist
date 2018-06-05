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
  let data = createTestObject(type);

  let minusOne = new moment().subtract(1, "h");
  let minusTwo = new moment().subtract(2, "h");
  const expectedLabel = minusOne.format("k") + ":00";
  const expectedValue = [];

  let hr;
  for (let i = 0; i < 23 + 1; i++) {
    expectedValue.push(0);
  }
  expectedValue[minusOne.format("k")] = 2;
  expectedValue[minusTwo.format("k")] = 3;

  let run;
  switch (type) {
    case "commits":
      run = commitsHours.generate(data);

      break;
    case "comments":
      run = commentsHours.generate(data);
      break;
    case "tests":
      run = testsHours.generate(data);
      break;
  }
  expect(run.labels).toContain(expectedLabel);
  expect(run.datasets[0].data).toEqual(expectedValue);
};

const createTestObject = type => {
  let minusOne = new moment().subtract(1, "h");
  let minusTwo = new moment().subtract(2, "h");
  let data;
  switch (type) {
    case "commits":
      data = {
        commits: {
          data: {
            27: [
              {
                author: "test name",
                committed_at: minusOne.format(),
                branch: "test",
                id: "id1"
              },
              {
                author: "test name2",
                committed_at: minusTwo.format(),
                branch: "test",
                id: "id2"
              }
            ],
            28: [
              {
                author: "test name",
                committed_at: minusOne.format(),
                branch: "test",
                id: "id3"
              },
              {
                author: "test name2",
                committed_at: minusTwo.format(),
                branch: "test",
                id: "id4"
              },
              {
                author: "test name3",
                committed_at: minusTwo.format(),
                branch: "test",
                id: "id4"
              }
            ]
          }
        }
      };
      break;

    case "comments":
      data = {
        comments: {
          data: {
            27: [
              {
                author: { name: "test name", id: 1 },
                created_at: minusOne.format()
              },
              {
                author: { name: "test name2", id: 2 },
                created_at: minusTwo.format()
              }
            ],
            28: [
              {
                author: { name: "test name", id: 1 },
                created_at: minusOne.format()
              },
              {
                author: { name: "test name2", id: 2 },
                created_at: minusTwo.format()
              },
              {
                author: { name: "test name3", id: 3 },
                created_at: minusTwo.format()
              }
            ]
          }
        }
      };
      break;
    case "tests":
      data = {
        commits: {
          data: {
            27: [
              {
                author: "test name",
                committed_at: minusOne.format(),
                branch: "test",
                id: "id1"
              },
              {
                author: "test name2",
                committed_at: minusTwo.format(),
                branch: "test",
                id: "id2"
              }
            ],
            28: [
              {
                author: "test name",
                committed_at: minusOne.format(),
                branch: "test",
                id: "id3"
              },
              {
                author: "test name2",
                committed_at: minusTwo.format(),
                branch: "test",
                id: "id4"
              },
              {
                author: "test name3",
                committed_at: minusTwo.format(),
                branch: "test",
                id: "id4"
              },
              {
                author: "test name5",
                committed_at: minusOne.format(),
                branch: "test",
                id: "id5"
              }
            ]
          },
          details: {
            id1: {
              status: "failed"
            },
            id2: {
              status: "failed"
            },
            id3: {
              status: "failed"
            },
            id4: {
              status: "failed"
            },
            id5: {
              status: "passed"
            }
          }
        }
      };
      console.log(data);
      break;
  }

  return data;
};
