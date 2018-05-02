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
    const url2 = baseUrl + url + "?per_page=200&active=true";
    const token = this.token;
    return axios
      .get(url2, {
        headers: {
          "Private-Token": this.token
        }
      })
      .then(response => response.data);
  };
  getUsers = () => {
    let url = "/users";
    return this.call(url);
  };

  mapUsers = data => {
    const users = [];

    data.forEach(u => {
      const ret = {
        name: u.name,
        id: u.id,
        status: u.state,
        image: u.avatar_url,
        username: u.username,
        profile: u.web_url
      };

      users.push(ret);
    });

    return users;
  };
}
export default Gitlab;
