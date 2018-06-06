import moment from "moment";
import palette from "google-palette";

let colorPallete;
export const generate = (data, periodFrom) => {
  //take time distribution and make units of measurement
  let unitCount;
  let labels;
  let d;
  let datasets;

  d = parseWeekdays(data);
  labels = d.labels;
  datasets = d.datasets;

  return {
    labels,
    datasets
  };
};

const parseWeekdays = d => {
  let labels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  let daysData;
  let data = {};
  const commits = d.commits.data;
  const details = d.commits.details;
  let color;

  labels.forEach(item => {
    data[item] = 0;
  });

  for (let projectId in commits) {
    for (let commit in commits[projectId]) {
      if (details[commits[projectId][commit].id].status === "failed") {
        let day = new moment(commits[projectId][commit].committed_at).format(
          "dddd"
        );

        data[day] = data[day] + 1;
      }
    }
  }
  daysData = [
    {
      label: "",
      backgroundColor: "rgba(255, 245, 221, 0.7)",
      data: Object.values(data),
      borderColor: "#FFDD8C",
      borderWidth: 1
    }
  ];

  return { labels, datasets: daysData };
};
