import moment from "moment";
import palette from "google-palette";

let colorPallete;
export const generate = (data, periodFrom) => {
  //take time distribution and make units of measurement
  let unitCount;
  let labels;
  let d;
  let datasets;

  d = parseHoursInDay(data);
  labels = d.labels;
  datasets = d.datasets;

  return {
    labels,
    datasets
  };
};

const parseHoursInDay = d => {
  let labels = [];

  let hoursData;
  let data = {};
  const commits = d.commits.data;
  let color;

  //We create labels by taking earliest day and adding a day on every loop
  let hr;
  for (let i = 0; i < 24; i++) {
    if (1 < 10) {
      hr = i;
    } else {
      hr = "0" + i;
    }

    labels.push(hr + ":00");
  }

  labels.forEach(item => {
    data[item] = 0;
  });

  for (let projectId in commits) {
    for (let commit in commits[projectId]) {
      let hour = new moment(commits[projectId][commit].committed_at).format(
        "H"
      );

      data[hour + ":00"] = data[hour + ":00"] + 1;
    }
  }

  hoursData = [
    {
      label: "",
      backgroundColor: "rgba(214, 236, 251, 0.5)",
      data: Object.values(data),
      borderColor: "#59B2EE",
      borderWidth: 1
    }
  ];

  return { labels, datasets: hoursData };
};
