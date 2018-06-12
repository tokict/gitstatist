import axios from "axios";
import moment from "moment";
import * as apiMock from "../apiMock";

export default class Gitlab {
  constructor(params) {
    this.url = params.url + "/api/v4";
    this.token = params.token;
    this.provider = params.provider;
  }

  call = (url, type) => {
    const baseUrl = this.url;
    const url2 = baseUrl + url;
    const token = this.token;

    if (process.env.NODE_ENV === "test") {
      return fakeResponse(type);
    }
    try {
      return axios
        .get(url2, {
          validateStatus: function(status) {
            return status >= 200 && status < 300; // default
          },

          headers: {
            "Private-Token": this.token
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
  fetchUsers = () => {
    let url = "/users?per_page=1000&active=true";
    return this.call(url, "users");
  };

  fetchProjects = () => {
    let url = "/projects?statistics=true&per_page=200";
    return this.call(url, "projects");
  };
  fetchProject = id => {
    let url = "/projects/" + id + "?statistics=true";

    return this.call(url, "projects");
  };

  fetchProjectUsers = (project, page) => {
    let url = "/projects/" + project + "/users?per_page=100&page=" + page;

    return this.call(url, "users");
  };

  searchProjects = search => {
    let url = "/projects?search=" + search + "&order_by=name";

    return this.call(url, "projects");
  };

  saveCommits = data => {
    axios.post("http://meandish.lo/api/scrap/saveData", data);
  };

  getSavedData = data => {
    return axios
      .post("http://meandish.lo/api/scrap/getData", {
        validateStatus: function(status) {
          return status >= 200 && status < 300; // default
        }
      })
      .then(response => {
        if (
          response.status == 200 &&
          response.data &&
          response.data != "false"
        ) {
          return response.data;
        }
        return {};
      });
  };

  fetchCommits = (id, branch, since, to, page) => {
    const start = new moment(since).format("YYYY-MM-DD");
    let url =
      "/projects/" +
      id +
      "/repository/commits?all=true&per_page=100&page=" +
      page +
      "&ref_name=" +
      branch +
      "&since=" +
      start;

    if (to && to.format("YYYY-MM-DD") !== start) {
      url += "&until=" + to.format("YYYY-MM-DD");
    }

    return this.call(url, "commits");
  };

  fetchComments = (id, branch, page) => {
    let url =
      "/projects/" +
      id +
      "/repository/commits/" +
      branch +
      "/comments?per_page=100&page=" +
      page;

    return this.call(url, "comments");
  };

  fetchMergeRequests = (id, start, page) => {
    let from = new moment(start).format("YYYY-MM-DD");
    let url = "/merge_requests?author_id=" + id + "&created_after=" + from;
    "&page=" + page;

    return this.call(url, "mergeRequests");
  };

  fetchCommitDetails = (sha, projectId) => {
    let url = "/projects/" + projectId + "/repository/commits/" + sha;

    return this.call(url, "commitDetails");
  };

  fetchBranches = projectId => {
    let url = "/projects/" + projectId + "/repository/branches";

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
        id: p.id,
        image: p.avatar_url,
        path: p.path_with_namespace,
        commitCount: p.statistics.commit_count,
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
