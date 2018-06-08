import Gitlab from "../adapters/Gitlab";
import * as apiMock from "../apiMock";
test("gitlab adapter fetches and maps", () => {
  let test = Adapter.fetchUsers();
  expect(test).toBeInstanceOf(Promise);

  test = Adapter.fetchProjects();
  expect(test).toBeInstanceOf(Promise);

  test = Adapter.fetchBranches();
  expect(test).toBeInstanceOf(Promise);

  test = Adapter.fetchCommits();
  expect(test).toBeInstanceOf(Promise);

  test = Adapter.fetchComments();
  expect(test).toBeInstanceOf(Promise);

  test = Adapter.fetchCommitDetails();
  expect(test).toBeInstanceOf(Promise);

  test = Adapter.fetchMergeRequests();
  expect(test).toBeInstanceOf(Promise);

  mapsUsers();
  mapsCommits();

  mapsProjects();
  mapsComments();
  mapsMergeRequests();
});

const Adapter = new Gitlab({
  url: "http://google.com",
  token: "test",
  provider: "gitlab"
});

const mapsUsers = () => {
  const users = Adapter.mapUsers(apiMock.usersMock);

  const expected = {
    aliases: [],
    comments: [],
    commits: [],
    id: 1,
    image: null,
    mergeRequests: [],
    name: "test user1",
    profile: "http://gitlab.com/test1",
    status: "active"
  };

  expect(users[1]).toEqual(expected);
};

const mapsCommits = () => {
  const commits = Adapter.mapCommits([apiMock.commitsMock]);
  const expected = {
    author: "test user2",
    created_at: "2018-06-07T11:58:23.000+03:00",
    committer: "test user2",
    committed_at: "2018-06-07T11:58:23.000+03:00",
    id: "020ff1ce5743a730559e5d7b36570b64e4955805",
    title: "Merge remote-tracking branch ",
    branch: "dev"
  };

  expect(commits[0]).toContainEqual(expected);
};

const mapsProjects = () => {
  const projects = Adapter.mapProjects(apiMock.projectsMock);

  const expected = {
    name: "calculator",
    id: 1,
    image: null,
    path: "test/calculator",
    commitCount: 1,
    branches: [],
    branchCommitNr: {}
  };

  expect(projects[1]).toEqual(expected);
};

const mapsComments = () => {
  const users = Adapter.mapUsers(apiMock.usersMock);

  const comments = Adapter.mapCommentsToUsers([apiMock.commentMock], users);

  const expected = {
    note: "fesafsefsg",
    path: "apps/admin/controllers/Controller.php",
    line: 20,
    line_type: "new",
    author: {
      id: 1,
      name: "test user1",
      username: "ttokic",
      state: "active",
      avatar_url:
        "http://gitlab.com/uploads/-/system/user/avatar/30/avatar.png",
      web_url: "http://gitlab.com/tokict"
    },
    created_at: "2018-06-07T12:00:13.455Z",
    branch: "master",
    projectId: 1
  };

  expect(comments.users[1].comments).toContainEqual(expected);
};

const mapsMergeRequests = () => {
  const users = Adapter.mapUsers(apiMock.usersMock);

  const mergeRequests = Adapter.mapMergeRequestsToUsers(
    apiMock.mergeRequestsMock,
    users
  );

  const expected = {
    name: "calculator",
    id: 1,
    image: null,
    path: "test/calculator",
    commitCount: 1,
    branches: [],
    branchCommitNr: {}
  };

  expect(mergeRequests.mergeRequests[1][0].title).toBe("Dev");
};
