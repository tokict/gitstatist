import moment from "moment";
import palette from "google-palette";

let colorPallete;
export const generate = (data, periodFrom) => {
  //take time distribution and make units of measurement
  let unitCount;
  let labels;
  let d;
  let datasets;

  d = parseBranches(data, periodFrom.date);
  labels = d.labels;
  datasets = d.datasets;

  return {
    labels,
    datasets
  };
};

const parseBranches = d => {
  let branchesData;
  const requests = d.mergeRequests.data;
  const projects = d.projects;
  let data = {};
  let color;

  for (let userId in requests) {
    for (let request in requests[userId]) {
      let projectId = requests[userId][request].target_project_id;
      let name = d.projects[projectId].name;
      let branch = requests[userId][request].target_branch;
      let combine = name + " -> " + branch;
      if (data[name]) {
        data[combine] = data[combine] + 1;
      } else {
        data[combine] = 1;
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
  sortable = sortable.splice(0, 7);
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
