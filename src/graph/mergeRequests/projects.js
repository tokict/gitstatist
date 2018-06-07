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
  const requests = d.mergeRequests.data;
  const projects = d.projects;
  let color;

  for (let userId in requests) {
    for (let request in requests[userId]) {
      let projectId = requests[userId][request].target_project_id;
      let name = d.projects[projectId].name;
      if (data[name]) {
        data[name] = data[name] + 1;
      } else {
        data[name] = 1;
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
