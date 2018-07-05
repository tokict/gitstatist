import axios from "axios";
import moment from "moment";
import * as apiMock from "../apiMock";
const projectStats = new Map();
export default class Github {
  constructor(params) {
    this.url = params.url + "/";
    this.token = params.token;
    this.provider = params.provider;
    this.username = params.username;
  }

  call = (url, type) => {
    const baseUrl = this.url;
    const url2 = baseUrl + url;
    const token = this.token;

    if (process.env.NODE_ENV === "test") {
      return fakeResponse(type);
    }

    let auth;
    switch (this.provider) {
      case "gitlab":
        auth = { "Private-Token": this.token };
        break;
      case "github":
        auth = {
          Authorization: "Basic " + btoa(this.username + ":" + this.token)
        };
        break;
    }
    try {
      return axios
        .get(url2, {
          validateStatus: function(status) {
            return status >= 200 && status < 300; // default
          },

          headers: {
            ...auth
          }
        })
        .then(response => {
          if (response.status == 200 && response.data) {
            return response;
          }
          return [];
        });
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  fetchProjects = () => {
    let url = "repos?since=1";
    return this.call(url, "projects");
  };

  fetchProject = id => {
    let url = "repos/" + id;

    return this.call(url, "projects");
  };

  fetchProjectUsers = (project, page) => {
    let url = "repos/" + project + "/contributors?per_page=100&page=" + page;

    return this.call(url, "users");
  };

  searchProjects = search => {
    let url = "search/repositories?q=" + search + "&order=name";

    return this.call(url, "projects");
  };

  fetchCommits = (id, branch, since, to, page) => {
    const start = new moment(since).format("YYYY-MM-DD");
    let url =
      "repos/" +
      id +
      "/commits?all=true&per_page=100&page=" +
      page +
      "&since=" +
      start;

    if (to && to.format("YYYY-MM-DD") !== start) {
      url += "&until=" + to.format("YYYY-MM-DD");
    }

    return this.call(url, "commits");
  };

  fetchComments = (id, branch, page) => {
    let url = "repos/" + id + "/comments?per_page=100&page=" + page;

    return this.call(url, "comments");
  };
  //Pull requests are by repo here, not per user
  fetchMergeRequests = (id, start, page) => {
    let url = "repos/" + id + "/pulls" + "&page=" + page;

    return this.call(url, "mergeRequests");
  };

  fetchCommitDetails = (sha, projectId) => {
    let url = "repos/" + projectId + "/commits/" + sha;

    return this.call(url, "commitDetails");
  };

  fetchBranches = projectId => {
    let url = "repos/" + projectId + "/branches";

    return this.call(url, "branches");
  };

  mapUsers = data => {
    const users = {};

    data.forEach(u => {
      let ret = {
        name: u.name,
        id: u.id,
        status: u.state,
        image: u.avatar_url,
        profile: u.web_url,
        commits: [],
        comments: [],
        aliases: [],
        mergeRequests: []
      };

      users[u.id] = ret;
    });

    return users;
  };

  mapProjects = data => {
    const projects = {};
    data.forEach(p => {
      if (!p.statistics) {
        console.log(p);
      }

      let ret = {
        name: p.name,
        owner: p.owner.login,
        id: p.id,
        image: p.avatar_url,
        path: p.path_with_namespace,
        commitCount: null,
        branches: [],
        branchCommitNr: {}
      };

      projects[p.id] = ret;
    });

    return projects;
  };

  mapCommits = data => {
    let formatted = [];
    for (let p in data) {
      if (!data[p]) return;
      formatted[p] = [];

      data[p].forEach(c => {
        let ret = {
          author: c.author_name,
          created_at: c.created_at,
          committer: c.committer_name,
          committed_at: c.committed_date,
          id: c.id,
          title: c.title,
          branch: c.branch
        };

        formatted[p].push(ret);
      });
    }

    return formatted;
  };

  mapCommentsToUsers = (comments, users) => {
    for (let projectId in comments) {
      if (!comments[projectId] || !comments[projectId].length) continue;

      for (let index in comments[projectId]) {
        let found = false;
        for (let userId in users) {
          if (
            comments[projectId][index].author.id == users[userId].id ||
            users[userId].aliases.includes(
              comments[projectId][index].author.name
            )
          ) {
            found = true;
            let val = comments[projectId][index].created_at;

            //Make sure we dont have this comment id already
            if (!this.commentExists(val, users[userId].comments)) {
              users[userId].comments.push(comments[projectId][index]);
            }
          }
        }
      }
    }

    return { users, comments };
  };

  mapMergeRequestsToUsers = (requests, users) => {
    for (let userId in requests) {
      for (let request in requests[userId]) {
        users[userId].mergeRequests.push(requests[userId][request].id);
      }
    }

    return { mergeRequests: requests, users };
  };

  //Check if we already have this comment saved so we dont duplicate it
  commentExists = (id, comments) => {
    let exists = false;
    if (comments) {
      for (let key in comments) {
        if (comments[key].created_at == id) {
          exists = true;
        }
      }
    }
    return exists;
  };

  //Get stats for one project
  getContributorStatistics(projectIdentifier) {
    if (!projectStats.has(projectIdentifier)) {
      projectStats.set(projectIdentifier, stats);
      let stats = this.call(
        "repos/" + projectIdentifier + "/stats/contributors",
        ""
      );
      return stats;
    } else {
      return new Promise().resolve(projectStats.get(projectIdentifier));
    }
  }
}

const fakeResponse = type => {
  const response = {
    headers: {
      "x-total-pages": 1
    }
  };
  switch (type) {
    case "commits":
      response.data = apiMock.commitsMock;
      break;

    case "mergeRequests":
      response.data = apiMock.mergeRequestsMock;
      break;

    case "comments":
      response.data = apiMock.commentMock;
      break;

    case "projects":
      response.data = apiMock.projectsMock;
      break;

    case "users":
      response.data = apiMock.usersMock;
      break;
  }

  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 10, response);
  });
};
