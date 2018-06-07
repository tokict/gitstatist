import moment from "moment";
import palette from "google-palette";

let colorPallete;
export const generate = (data, periodFrom) => {
  //take time distribution and make units of measurement
  let unitCount;
  let labels;
  let d;
  let datasets;

  d = parseBranches(data);
  labels = d.labels;
  datasets = d.datasets;

  return {
    labels,
    datasets
  };
};

const parseBranches = d => {
  let branchesData;
  const projects = d.projects;
  const commits = d.commits.data;
  const commitDetails = d.commits.details;
  let data = {};
  let color;

  for (let projectId in projects) {
    if (!projects[projectId]) continue;
    for (let branch in projects[projectId].branches) {
      data[
        projects[projectId].name + " -> " + projects[projectId].branches[branch]
      ] = 0;

      if (commits && commits[projectId]) {
        for (let commit in commits[projectId]) {
          data[
            projects[projectId].name +
              " -> " +
              commits[projectId][commit].branch
          ]++;
        }
      }
    }
  }

  let sortable = [];
  for (let d in data) {
    sortable.push([d, data[d]]);
  }

  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });

  const sortedData = {};
  sortable = sortable.splice(0, 5);
  sortable.forEach(item => {
    sortedData[item[0]] = item[1];
  });

  branchesData = [
    {
      label: "",
      backgroundColor: "rgba(214, 236, 251, 0.5)",
      data: Object.values(sortedData),
      borderColor: "#59B2EE",
      borderWidth: 1
    }
  ];

  return { labels: Object.keys(sortedData), datasets: branchesData };
};
