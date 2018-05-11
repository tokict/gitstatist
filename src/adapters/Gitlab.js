import axios from "axios";
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
          return response.data;
        }
        return [];
      });
  };
  fetchUsers = () => {
    let url = "/users?per_page=1000&active=true";
    return this.call(url);
  };

  fetchProjects = () => {
    let url = "/projects?simple=true&per_page=200";
    return this.call(url);
  };

  fetchCommits = (id, since) => {
    if (!since) {
      let days = 180;
      let date = new Date();
      since = new Date(
        date.getTime() - days * 24 * 60 * 60 * 1000
      ).toISOString();
    }

    const commits = [];

    let url =
      "/projects/" +
      id +
      "/repository/commits?all=true&&per_page=1000&since=" +
      since;

    const d = this.call(url);

    return d;
  };

  mapUsers = data => {
    const users = {};

    data.forEach(u => {
      const ret = {
        name: u.name,
        id: u.id,
        status: u.state,
        image: u.avatar_url,
        profile: u.web_url,
        commits: [],
        aliases: []
      };

      users[u.id] = ret;
    });

    return users;
  };

  mapProjects = data => {
    const projects = {};

    data.forEach(p => {
      const ret = {
        name: p.name,
        id: p.id,
        image: p.avatar_url,
        path: p.path_with_namespace
      };

      projects[p.id] = ret;
    });

    return projects;
  };

  mapCommits = data => {
    let formatted = [];

    data.forEach(p => {
      if (!p || !p.id) return;
      formatted[p.id] = [];
      p.data.forEach(c => {
        const ret = {
          author: c.author_name,
          message: c.message,
          created_at: c.created_at,
          commiter: c.commiter_name,
          commited_at: c.committed_date,
          id: c.id,
          title: c.title
        };

        formatted[p.id].push(ret);
      });
    });

    return formatted;
  };
}
export default Gitlab;
