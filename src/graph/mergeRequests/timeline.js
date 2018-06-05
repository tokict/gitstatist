import moment from "moment";
import palette from "google-palette";

let colorPallete;
export const generate = (data, periodFrom) => {
  colorPallete = palette("qualitative", Object.keys(data.users).length);
  //take time distribution and make units of measurement
  let unitCount;
  let labels;
  let d;
  let datasets;

  switch (periodFrom.id) {
    case 0:
      d = parseHoursInDay(data, periodFrom.date);
      labels = d.labels;
      datasets = d.datasets;
      break;

    case 1:
      d = parseDaysInWeek(data, periodFrom.date);
      labels = d.labels;
      datasets = d.datasets;

      break;

    case 2:
      d = parseDaysInMonth(data, periodFrom.date);
      labels = d.labels;
      datasets = d.datasets;

      break;

    case 3:
      d = parseWeeks(data, periodFrom.date, 14);
      labels = d.labels;
      datasets = d.datasets;
      break;

    case 4:
      d = parseWeeks(data, periodFrom.date, 52);
      labels = d.labels;
      datasets = d.datasets;
  }

  return {
    labels,
    datasets
  };
};

const parseHoursInDay = (data, since) => {
  let labels = [];
  let datasets = [];

  const requests = data.mergeRequests.data;
  const users = data.users;
  const usersData = {};
  let color;
  let cp = colorPallete.map(item => item);

  //Get all hours between midnight and now as labels
  let nrHours = new moment().format("HH") * 1;

  if (since instanceof moment == false) {
    since = new moment(since);
  }

  //We create labels by taking earliest day and adding a day on every loop
  for (let i = 0; i < nrHours + 1; i++) {
    let a = since.clone();
    labels.push(a.add(i, "H").format("HH") + ":00");
  }

  for (let userId in requests) {
    for (let request in requests[userId]) {
      let requestId = requests[userId][request].id;
      let name = requests[userId][request].author.name;

      if (!usersData[userId]) {
        color = cp[0];
        cp.splice(0, 1);

        let data = {};

        labels.forEach(item => {
          data[item] = 0;
        });

        usersData[userId] = {
          label: name,
          backgroundColor: "transparent",
          data: data,
          borderColor: "#" + color,
          borderWidth: 2
        };
      }

      let date =
        new moment(requests[userId][request].created_at).format("HH") + ":00";

      usersData[userId].data[date] = usersData[userId].data[date]
        ? usersData[userId].data[date]++
        : 1;
    }
  }

  for (let user in usersData) {
    usersData[user].data = Object.values(usersData[user].data);
  }

  return { labels, datasets: Object.values(usersData) };
};

const parseDaysInWeek = (data, since) => {
  let labels = [];
  let datasets = [];
  const requests = data.mergeRequests.data;
  const users = data.users;
  const usersData = {};
  let color;
  let cp = colorPallete.map(item => item);
  if (since instanceof moment == false) {
    since = new moment(since);
  }

  //We create labels by taking earliest day and adding a day on every loop
  labels.push(since.format("DD.MM"));
  for (var i = 1; i < 8; i++) {
    let a = since.clone();
    labels.push(a.add(i, "d").format("DD.MM"));
  }

  for (let userId in requests) {
    for (let request in requests[userId]) {
      let requestId = requests[userId][request].id;
      let name = requests[userId][request].author.name;

      if (!usersData[userId]) {
        color = cp[0];
        cp.splice(0, 1);

        let data = {};

        labels.forEach(item => {
          data[item] = 0;
        });
        usersData[userId] = {
          label: name,
          backgroundColor: "transparent",
          data: data,
          borderColor: "#" + color,
          borderWidth: 2
        };
      }

      let date = new moment(requests[userId][request].created_at).format(
        "DD.MM"
      );

      usersData[userId].data[date] = usersData[userId].data[date]
        ? usersData[userId].data[date]++
        : 1;
    }
  }

  for (let user in usersData) {
    usersData[user].data = Object.values(usersData[user].data);
  }

  return { labels, datasets: Object.values(usersData) };
};

const parseDaysInMonth = (data, since) => {
  let labels = [];
  let datasets = [];
  const requests = data.mergeRequests.data;
  const users = data.users;
  const usersData = {};
  let color;
  let cp = colorPallete.map(item => item);
  if (since instanceof moment == false) {
    since = new moment(since);
  }

  //We create labels by taking earliest day and adding a day on every loop

  for (var i = 0; i < 31; i++) {
    let a = since.clone();
    labels.push(a.add(i, "days").format("DD.MM"));
  }

  for (let userId in requests) {
    for (let request in requests[userId]) {
      let requestId = requests[userId][request].id;
      let name = requests[userId][request].author.name;

      if (!usersData[userId]) {
        color = cp[0];
        cp.splice(0, 1);

        let data = {};

        labels.forEach(item => {
          data[item] = 0;
        });

        usersData[userId] = {
          label: name,
          backgroundColor: "transparent",
          data: data,
          borderColor: "#" + color,
          borderWidth: 2
        };
      }

      let date = new moment(requests[userId][request].created_at).format(
        "DD.MM"
      );

      usersData[userId].data[date] = usersData[userId].data[date]
        ? usersData[userId].data[date]++
        : 1;
    }
  }

  for (let user in usersData) {
    usersData[user].data = Object.values(usersData[user].data);
  }

  return { labels, datasets: Object.values(usersData) };
};

const parseWeeks = (data, since, weeks) => {
  const labels = [];
  const periods = [];
  let datasets = [];
  const requests = data.mergeRequests.data;
  const users = data.users;
  const usersData = {};
  let color;
  let cp = colorPallete.map(item => item);

  if (since instanceof moment == false) {
    since = new moment(since);
  }

  //We create labels by taking earliest day and adding a day on every loop

  for (var i = 1; i < weeks; i++) {
    let start1 = since
      .clone()
      .add(i - 1, "w")
      .format("DD.MM");
    let start2 = since
      .clone()
      .add(i - 1, "w")
      .format("YYYY-MM-DD");
    let finish1 = since
      .clone()
      .add(i, "w")
      .format("DD.MM");
    let finish2 = since
      .clone()
      .add(i, "w")
      .format("YYYY-MM-DD");

    labels.push(start1 + " - " + finish1);

    periods.push(start2 + " - " + finish2);
  }

  for (let userId in requests) {
    for (let request in requests[userId]) {
      let requestId = requests[userId][request].id;
      let name = requests[userId][request].author.name;

      if (!usersData[userId]) {
        color = cp[0];
        cp.splice(0, 1);

        let data = {};

        labels.forEach(item => {
          data[item] = 0;
        });
        usersData[userId] = {
          label: name,
          backgroundColor: "transparent",
          data: data,
          borderColor: "#" + color,
          borderWidth: 2
        };
      }

      let date = new moment(requests[userId][request].created_at);
      periods.forEach((period, i) => {
        let parts = period.split(" - ");

        let start = new moment(parts[0]);
        let end = new moment(parts[1]);

        if (date.isBetween(start, end)) {
          usersData[userId].data[labels[i]] = usersData[userId].data[labels[i]]
            ? usersData[userId].data[labels[i]]++
            : 1;
        }
      });
    }
  }

  for (let user in usersData) {
    usersData[user].data = Object.values(usersData[user].data);
  }

  return { labels, datasets: Object.values(usersData) };
};
