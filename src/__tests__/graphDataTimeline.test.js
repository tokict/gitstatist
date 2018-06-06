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

test("commitTimeline has a proper data object", () => {
  runTest("commits");
});

// test("commentsTimeline has a proper data object", () => {
//   runTest("comments");
// });

// test("testTimeline graph has a proper data object", () => {
//   runTest("tests");
// });

// test("refactoringtimelines has a proper data object", () => {
//   runTest("refactoring");
// });

// test("newCodeTimeline has a proper data object", () => {
//   runTest("newCode");
// });

// test("mergeRequestsTimeline graph has a proper data object", () => {
//   runTest("mergeRequests");
// });

const runTest = type => {
  let periods = {
    0: new moment().startOf("day"),
    1: new moment().subtract(7, "days"),
    2: new moment().subtract(30, "days"),
    3: new moment().subtract(90, "days"),
    4: new moment().subtract(365, "days")
  };

  let run;
  switch (type) {
    case "commits":
      for (let period in periods) {
        //Set commit times for tracking
        let times = generateTimes(period);
        let { one, two, expectedLabel, expectedValue } = times;

        console.warn(expectedValue);

        const containObj = {
          label: "test name1",
          backgroundColor: "transparent",
          data: expectedValue,
          borderColor: "#7fc97f",
          borderWidth: 2
        };

        let data = createTestObject(type, one, two);
        run = commitsTimeline.generate(data, {
          id: period * 1,
          date: periods[period]
        });

        //Check
        expect(run.labels).toContain(expectedLabel);
        expect(run.datasets).toContainEqual(containObj);
      }
      break;
    case "refactoring":
      run = refactoringTimeline.generate(data);
      expectedValue[one.format("k")] = 3;
      expectedValue[two.format("k")] = 3;
      break;
    case "newCode":
      run = newCodeTimeline.generate(data);
      expectedValue[one.format("k")] = 3;
      expectedValue[two.format("k")] = 3;
      break;
    case "mergeRequests":
      run = mergeRequestsTimeline.generate(data);
      expectedValue[one.format("k")] = 3;
      expectedValue[two.format("k")] = 3;
      break;
    case "comments":
      run = commentsTimeline.generate(data);
      expectedValue[one.format("k")] = 2;
      expectedValue[two.format("k")] = 3;
      break;
    case "tests":
      run = testsTimeline.generate(data);
      expectedValue[one.format("k")] = 2;
      expectedValue[two.format("k")] = 3;
      break;
  }
};

const generateTimes = id => {
  let one;
  let two;
  let expectedLabel;
  let expectedValue = [];
  let labelNr;
  switch (id * 1) {
    //today
    case 0:
      one = new moment().subtract(1, "h");
      two = new moment().subtract(2, "h");
      expectedLabel = one.format("H") + ":00";
      labelNr = new moment().format("H") * 1 + 1;

      for (let i = 0; i < labelNr; i++) {
        expectedValue.push(0);
      }

      //Expected to contain
      expectedValue[one.format("H") * 1] = 2;

      break;

    case 1:
      //7 days

      one = new moment().subtract(1, "days");
      two = new moment().subtract(2, "days");
      expectedLabel = one.format("DD.MM");
      labelNr = 8;
      for (let i = 0; i < labelNr; i++) {
        expectedValue.push(0);
      }
      //Expected to contain
      expectedValue[expectedValue.length - 2] = 2;

      break;

    case 2:
      //30 days
      one = new moment().subtract(5, "days");
      two = new moment().subtract(7, "days");

      expectedLabel = one.format("DD.MM");
      labelNr = 31;
      for (let i = 0; i < labelNr; i++) {
        expectedValue.push(0);
      }
      //Expected to contain
      expectedValue[expectedValue.length - 6] = 2;
      console.warn(labelNr, expectedValue, two.format("e") * 1);

      break;

    case 3:
      //90 days
      one = new moment().subtract(13, "days");
      two = new moment().subtract(45, "days");

      expectedLabel = generateWeekPeriods(
        new moment().subtract(90, "days"),
        12
      )[6];

      labelNr = 14;
      for (let i = 1; i < labelNr; i++) {
        expectedValue.push(0);
      }
      //Expected to contain
      expectedValue[expectedValue.length - 2] = 2;

      break;

    case 4:
      //year
      one = new moment().subtract(50, "days");
      two = new moment().subtract(90, "days");

      expectedLabel = generateWeekPeriods(
        new moment().subtract(365, "days"),
        52
      )[12];

      labelNr = 52;
      for (let i = 1; i < labelNr; i++) {
        expectedValue.push(0);
      }
      //Expected to contain
      expectedValue[expectedValue.length - 6] = 2;

      break;
  }

  return { one, two, expectedLabel, expectedValue };
};

const generateWeekPeriods = (since, weeks) => {
  const labels = [];
  for (var i = 1; i < weeks; i++) {
    let start1 = since
      .clone()
      .add(i - 1, "w")
      .format("DD.MM");
    let start2 = since
      .clone()
      .add(i - 1, "w")
      .format("YYYY-MM-DD");
    let finish1 = since
      .clone()
      .add(i, "w")
      .format("DD.MM");
    let finish2 = since
      .clone()
      .add(i, "w")
      .format("YYYY-MM-DD");

    labels.push(start1 + " - " + finish1);
  }
  return labels;
};
