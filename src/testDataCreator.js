const createTestObject = (type, one, two) => {
  let data;
  switch (type) {
    case "commits":
      data = generateCommits(one, two);
      break;

    case "comments":
      data = {
        comments: {
          data: {
            27: [
              {
                author: { name: "test name", id: 1 },
                created_at: one.format()
              },
              {
                author: { name: "test name2", id: 2 },
                created_at: two.format()
              }
            ],
            28: [
              {
                author: { name: "test name", id: 1 },
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
      break;
    case "tests":
      data = generateCommits(one, two);

      break;
  }

  return data;
};

const generateCommits = (one, two) => ({
  commits: {
    data: {
      27: [
        {
          author: "test name",
          committed_at: one.format(),
          branch: "test",
          id: "id1"
        },
        {
          author: "test name2",
          committed_at: two.format(),
          branch: "test",
          id: "id2"
        }
      ],
      28: [
        {
          author: "test name",
          committed_at: one.format(),
          branch: "test",
          id: "id3"
        },
        {
          author: "test name2",
          committed_at: two.format(),
          branch: "test",
          id: "id4"
        },
        {
          author: "test name3",
          committed_at: two.format(),
          branch: "test",
          id: "id4"
        },
        {
          author: "test name5",
          committed_at: one.format(),
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
});

export default createTestObject;
