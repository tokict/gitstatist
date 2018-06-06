const Users = {
  data: {
    1: {
      id: 1,
      name: "test name1"
    },
    2: {
      id: 2,
      name: "test name2"
    },
    3: {
      id: 3,
      name: "test name3"
    },
    4: {
      id: 4,
      name: "test name4"
    },
    5: {
      id: 5,
      name: "test name5"
    }
  }
};

const createTestObject = (type, one, two) => {
  let data;
  switch (type) {
    case "commits":
      data = generateCommits(one, two);
      data.users = Users.data;
      break;

    case "comments":
      data = {
        comments: {
          data: {
            27: [
              {
                author: { name: "test name1", id: 1 },
                created_at: one.format()
              },
              {
                author: { name: "test name2", id: 2 },
                created_at: two.format()
              }
            ],
            28: [
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
        }
      };

      data.users = Users.data;

      break;
    case "tests":
      data = generateCommits(one, two);
      data.users = Users.data;
      break;

    case "refactoring":
      data = generateCommits(one, two);
      data.users = Users.data;
      break;

    case "newCode":
      data = generateCommits(one, two);
      data.users = Users.data;
      break;

    case "mergeRequests":
      data = generateMergeRequests(one, two);
      data.users = Users.data;
      break;
  }

  return data;
};

const generateCommits = (one, two) => ({
  commits: {
    data: {
      27: [
        {
          author: "test name1",
          committed_at: one.format(),
          branch: "test",
          id: "id1",
          userId: 1
        },
        {
          author: "test name2",
          committed_at: two.format(),
          branch: "test",
          id: "id2",
          userId: 2
        }
      ],
      28: [
        {
          author: "test name1",
          committed_at: one.format(),
          branch: "test",
          id: "id3",
          userId: 1
        },
        {
          author: "test name2",
          committed_at: two.format(),
          branch: "test",
          id: "id4",
          userId: 2
        },
        {
          author: "test name3",
          committed_at: two.format(),
          branch: "test",
          id: "id4",
          userId: 3
        },
        {
          author: "test name5",
          committed_at: one.format(),
          branch: "test",
          id: "id5",
          userId: 5
        }
      ]
    },
    details: {
      id1: {
        status: "failed",
        stats: {
          additions: 5,
          deletions: 3
        }
      },
      id2: {
        status: "failed",
        stats: {
          additions: 5,
          deletions: 3
        }
      },
      id3: {
        status: "failed",
        stats: {
          additions: 5,
          deletions: 3
        }
      },
      id4: {
        status: "failed",
        stats: {
          additions: 5,
          deletions: 3
        }
      },
      id5: {
        status: "passed",
        stats: {
          additions: 5,
          deletions: 3
        }
      }
    }
  }
});

const generateMergeRequests = (one, two) => ({
  mergeRequests: {
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
  }
});

export default createTestObject;
