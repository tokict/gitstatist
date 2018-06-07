const Users = {
  data: {
    1: {
      id: 1,
      name: "test name1",
      commits: [1, 2, 3],
      comments: [1, 2, 3],
      mergeRequests: 12,
      failedTests: 12
    },
    2: {
      id: 2,
      name: "test name2",
      commits: [1, 2],
      comments: [1, 2],
      mergeRequests: 23,
      failedTests: 3
    },
    3: {
      id: 3,
      name: "test name3",
      commits: [1, 2, 3, 4],
      comments: [1, 2, 3, 4],
      mergeRequests: 1,
      failedTests: 14
    },
    4: {
      id: 4,
      name: "test name4",
      commits: [1, 2, 3, 4, 5],
      comments: [1, 2, 3, 4, 5],
      mergeRequests: 3,
      failedTests: 66
    },
    5: {
      id: 5,
      name: "test name5",
      commits: [],
      comments: [],
      mergeRequests: [],
      failedTests: 0
    }
  }
};

const generateComments = (one, two) => ({
  data: {
    1: [
      {
        author: { name: "test name1", id: 1 },
        created_at: one.format()
      },
      {
        author: { name: "test name2", id: 2 },
        created_at: two.format()
      }
    ],
    2: [
      {
        author: { name: "test name1", id: 1 },
        created_at: one.format()
      },
      {
        author: { name: "test name2", id: 2 },
        created_at: two.format()
      },
      {
        author: { name: "test name3", id: 3 },
        created_at: two.format()
      }
    ]
  }
});

const Projects = {
  data: {
    1: {
      id: 1,
      name: "Project1",
      branches: ["dev", "master"],
      branchCommitNr: {
        dev: 2
      },
      commentsNr: {
        dev: 2
      }
    },
    2: {
      id: 2,
      name: "Project2",
      branches: ["dev", "master"],
      branchCommitNr: {
        dev: 1,
        master: 3
      },
      commentsNr: {
        master: 3
      }
    },
    3: {
      id: 3,
      name: "Project3",
      branches: ["dev", "master"]
    },
    4: {
      id: 4,
      name: "Project4",
      branches: ["dev", "master"]
    }
  }
};

const createTestObject = (one, two) => {
  let data = generateCommits(one, two);
  data.users = Users.data;
  data.comments = generateComments(one, two).data;
  data.projects = Projects.data;
  data.mergeRequests = generateMergeRequests(one, two);
  return data;
};

const generateCommits = (one, two) => ({
  commits: {
    data: {
      1: [
        {
          author: "test name1",
          committed_at: one.format(),
          branch: "dev",
          id: "id1",
          userId: 1
        },
        {
          author: "test name2",
          committed_at: two.format(),
          branch: "dev",
          id: "id2",
          userId: 2
        }
      ],
      2: [
        {
          author: "test name1",
          committed_at: one.format(),
          branch: "master",
          id: "id3",
          userId: 1
        },
        {
          author: "test name2",
          committed_at: two.format(),
          branch: "master",
          id: "id4",
          userId: 2
        },
        {
          author: "test name3",
          committed_at: two.format(),
          branch: "master",
          id: "id4",
          userId: 3
        },
        {
          author: "test name5",
          committed_at: one.format(),
          branch: "dev",
          id: "id5",
          userId: 5
        }
      ]
    },
    details: {
      id1: {
        status: "failed",
        project_id: 1,
        stats: {
          additions: 5,
          deletions: 3
        }
      },
      id2: {
        status: "failed",
        project_id: 1,
        stats: {
          additions: 5,
          deletions: 3
        }
      },
      id3: {
        status: "failed",
        project_id: 2,
        stats: {
          additions: 5,
          deletions: 3
        }
      },
      id4: {
        status: "failed",
        project_id: 2,
        stats: {
          additions: 5,
          deletions: 3
        }
      },
      id5: {
        status: "passed",
        project_id: 2,
        stats: {
          additions: 5,
          deletions: 3
        }
      }
    }
  }
});

const generateMergeRequests = (one, two) => ({
  data: {
    1: [
      {
        id: 1,
        target_branch: "master",
        target_project_id: 1,
        author: { name: "test name1", id: 1 },
        created_at: one.format(),
        branch: "test"
      },
      {
        id: 2,
        target_branch: "master",
        target_project_id: 1,
        author: { name: "test name1", id: 1 },
        committed_at: two.format()
      }
    ],
    2: [
      {
        id: 4,
        target_branch: "master",
        target_project_id: 2,
        author: { name: "test name2", id: 2 },
        created_at: one.format()
      },
      {
        id: 5,
        target_branch: "master",
        target_project_id: 2,
        author: { name: "test name2", id: 2 },
        committed_at: two.format()
      },
      {
        id: 6,
        target_branch: "dev",
        target_project_id: 3,
        author: "test name3",
        created_at: two.format(),
        author: { name: "test name2", id: 2 }
      },
      {
        id: 7,
        target_branch: "dev",
        target_project_id: 3,
        author: "test name5",
        created_at: one.format(),
        author: { name: "test name2", id: 2 }
      }
    ]
  }
});

export default createTestObject;
