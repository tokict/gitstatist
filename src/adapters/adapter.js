import Bitbucket from "./Bitbucket";
import Gitlab from "./Gitlab";
import Github from "./Github";

const ApiAdapter = params => {
  let adapter;

  switch (params.provider) {
    case "bitbucket":
      adapter = new Bitbucket(params);
      break;

    case "gitlab":
      adapter = new Gitlab(params);

      break;
    case "github":
      adapter = new Github(params);
      break;
  }
  return adapter;
};

export default ApiAdapter;
