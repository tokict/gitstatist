import moment from "moment";
import palette from "google-palette";

let colorPallete;
export const generate = (data, periodFrom) => {
  //take time distribution and make units of measurement
  let unitCount;
  let labels;
  let d;
  let datasets;

  d = parseProjects(data, periodFrom.date);
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
  const details = d.commits.details;
  let color;

  for (let projectId in commits) {
    let count = 0;
    for (let commit in commits[projectId]) {
      if (details[commits[projectId][commit].id].status === "failed") count++;
    }
    for (let id in d.projects) {
      if (d.projects[projectId]) {
        data[d.projects[projectId].name] = count;
      }
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
