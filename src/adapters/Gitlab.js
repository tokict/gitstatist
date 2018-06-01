import axios from "axios";
import moment from "moment";
const getToken = state => state.Server.token;
const getUrl = state => state.Server.url + "/api/v4/";
const getProvider = state => state.Server.provider;

class Gitlab {
  constructor(params) {
    this.url = params.url + "/api/v4";
    this.token = params.token;
    this.provider = params.provider;
  }

  call = url => {
    const baseUrl = this.url;
    const url2 = baseUrl + url;
    const token = this.token;
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
    return this.call(url);
  };

  fetchProjects = () => {
    let url = "/projects?statistics=true&per_page=200";
    return this.call(url);
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

    return this.call(url);
  };

  fetchComments = (id, branch, page) => {
    let url =
      "/projects/" +
      id +
      "/repository/commits/" +
      branch +
      "/comments?per_page=100&page=" +
      page;

    return this.call(url);
  };

  fetchMergeRequests = (id, start, page) => {
    let from = new moment(start).format("YYYY-MM-DD");
    let url = "/merge_requests?author_id=" + id + "&created_after=" + from;
    "&page=" + page;

    return this.call(url);
  };

  fetchCommitDetails = (sha, projectId) => {
    let url = "/projects/" + projectId + "/repository/commits/" + sha;

    return this.call(url);
  };

  fetchBranches = projectId => {
    let url = "/projects/" + projectId + "/repository/branches";

    return this.call(url);
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
          title: c.title
        };

        formatted[p].push(ret);
      });
    }

    return formatted;
  };
}
export default Gitlab;
