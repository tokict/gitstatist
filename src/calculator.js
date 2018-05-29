import React, { Component } from "react";
import { UserCard } from "./components/userCard/userCard";

export const commits = data => {
  const list = [];

  data.sort((a, b) => b.commits.length - a.commits.length);

  data.map((item, index) => {
    item.commits.length
      ? list.push(
          <UserCard
            key={item.id}
            order={index + 1}
            name={item.name}
            number={item.commits.length}
            image={item.image}
            description={"commits"}
          />
        )
      : null;
  });
  return list;
};

export const refactoring = (data, details) => {
  if (!details) return;
  const list = [];
  const users = [];

  data = getCommitDetails(data, details);

  for (let user in data) {
    let refScore = 0;
    for (let commit in data[user].commitDetails) {
      let num1 = data[user].commitDetails[commit].stats.additions;
      let num2 = data[user].commitDetails[commit].stats.deletions;
      //This is probably file permission change or some other weird mass addition
      if (num1 < 3000) {
        refScore += num1 > num2 ? num2 : num1;
      }
    }
    data[user].refScore = refScore;
  }

  data.sort((a, b) => b.refScore - a.refScore);

  data.map((item, index) => {
    item.refScore
      ? list.push(
          <UserCard
            key={item.id}
            order={index + 1}
            name={item.name}
            number={item.refScore}
            image={item.image}
            description={"lines changed"}
          />
        )
      : null;
  });

  return list;
};

export const newCode = (data, details) => {
  if (!details) return;
  const list = [];
  const users = [];

  data = getCommitDetails(data, details);

  for (let user in data) {
    let newCodeScore = 0;
    for (let commit in data[user].commitDetails) {
      let num1 = data[user].commitDetails[commit].stats.additions;
      let num2 = data[user].commitDetails[commit].stats.deletions;
      //This is probably file permission change or some other weird mass addition
      if (num1 < 3000) {
        newCodeScore += num1 > num2 ? num1 - num2 : num2 - num1;
      }
    }
    data[user].newCodeScore = newCodeScore;
  }

  data.sort((a, b) => b.newCodeScore - a.newCodeScore);

  data.map((item, index) => {
    item.newCodeScore
      ? list.push(
          <UserCard
            key={item.id}
            order={index + 1}
            name={item.name}
            number={item.newCodeScore}
            image={item.image}
            description={"new lines"}
          />
        )
      : null;
  });

  return list;
};

export const comments = data => {
  const list = [];

  data.sort((a, b) => b.comments.length - a.comments.length);

  data.map((item, index) => {
    item.comments.length
      ? list.push(
          <UserCard
            key={item.id}
            order={index + 1}
            name={item.name}
            number={item.comments.length}
            image={item.image}
            description={"comments made"}
          />
        )
      : null;
  });

  return list;
};

export const failedTests = (data, details) => {
  if (!details) return;
  const list = [];
  const users = [];

  data = getCommitDetails(data, details);

  for (let user in data) {
    let failed = 0;
    for (let commit in data[user].commitDetails) {
      if (data[user].commitDetails[commit].status == "failed") {
        failed++;
      }
    }
    data[user].failedTests = failed;
  }

  data.sort((a, b) => b.failedTests - a.failedTests);

  data.map((item, index) => {
    item.failedTests
      ? list.push(
          <UserCard
            key={item.id}
            order={index + 1}
            name={item.name}
            number={item.failedTests}
            image={item.image}
            description={"failed automated tests"}
          />
        )
      : null;
  });

  return list;
};

function getCommitDetails(data, details) {
  for (let user in data) {
    const commits = [];
    for (let commit in data[user].commits) {
      const d = details[data[user].commits[commit]];
      if (d) {
        commits.push(d);
      }
    }
    data[user].commitDetails = commits;
  }

  return data;
}
