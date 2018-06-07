import moment from "moment";
import palette from "google-palette";

let colorPallete;
export const generate = (data, periodFrom) => {
  //take time distribution and make units of measurement
  let unitCount;
  let labels;
  let d;
  let datasets;

  d = parseProjects(data);
  labels = d.labels;
  datasets = d.datasets;

  return {
    labels,
    datasets
  };
};

const parseProjects = d => {
  let labels = [];

  let projectsData;
  let data = {};
  const commits = d.commits.data;
  const commitDetails = d.commits.details;
  let color;

  for (let projectId in commits) {
    let newCodeScore = 0;
    if (d.projects[projectId]) {
      for (let commit in commits[projectId]) {
        let additions =
          commitDetails[commits[projectId][commit].id].stats.additions;
        let deletions =
          commitDetails[commits[projectId][commit].id].stats.deletions;
        //This is probably file permission change or some other weird mass addition
        if (additions < 10000) {
          //Take difference between new code and deleted
          newCodeScore += Math.abs(additions - deletions);
        }
      }

      data[d.projects[projectId].name] = newCodeScore;
    }
  }

  let sortable = [];
  for (let d in data) {
    if (data[d]) {
      sortable.push([d, data[d]]);
    }
  }

  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });

  const sortedData = {};
  sortable = sortable.splice(0, 7);
  sortable.forEach(item => {
    sortedData[item[0]] = item[1];
  });

  projectsData = [
    {
      label: "",
      backgroundColor: "rgba(214, 236, 251, 0.5)",
      data: Object.values(sortedData),
      borderColor: "#59B2EE",
      borderWidth: 1
    }
  ];

  return { labels: Object.keys(sortedData), datasets: projectsData };
};
