import moment from "moment";
import palette from "google-palette";
export const generate = (data, type, periodFrom) => {
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
      d = parse90Days(data, periodFrom.date);
      labels = d.labels;
      datasets = d.datasets;
      break;

    case 4:
      d = parseYear(data, periodFrom.date);
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
  const commits = data.commits;
  const users = data.users;
  const usersData = {};
  let color;

  //Get all hours between midnight and now as labels
  let nrHours = new moment().format("HH");
  if (since instanceof moment == false) {
    since = new moment(since);
  }
  let colorPallete = palette("qualitative", Object.keys(users).length);

  //We create labels by taking earliest day and adding a day on every loop
  for (let i = 0; i < nrHours + 1; i++) {
    let a = since.clone();
    labels.push(a.add(i, "H").format("HH") + ":00");
  }

  for (let projectId in commits) {
    for (let commit in commits[projectId]) {
      let id = commits[projectId][commit].userId;

      if (!id) continue;

      if (!usersData[id]) {
        color = colorPallete[0];
        colorPallete.splice(0, 1);

        let name;
        for (let user in users) {
          if (users[user].id == id) name = users[user].name;
        }

        let data = {};

        labels.forEach(item => {
          data[item] = 0;
        });

        usersData[id] = {
          label: name,
          backgroundColor: "transparent",
          data: data,
          borderColor: "#" + color,
          borderWidth: 2
        };
      }

      let date =
        new moment(commits[projectId][commit].committed_at).format("HH") +
        ":00";

      usersData[id].data[date] = usersData[id].data[date]
        ? usersData[id].data[date] + 1
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
  const commits = data.commits;
  const users = data.users;
  const usersData = {};
  let color;

  if (since instanceof moment == false) {
    since = new moment(since);
  }
  let colorPallete = palette("qualitative", Object.keys(users).length);

  //We create labels by taking earliest day and adding a day on every loop
  labels.push(since.format("DD.MM"));
  for (var i = 0; i < 7; i++) {
    let a = since.clone();
    labels.push(a.add(i, "d").format("DD.MM"));
  }

  for (let projectId in commits) {
    for (let commit in commits[projectId]) {
      let id = commits[projectId][commit].userId;
      if (!id) continue;

      if (!usersData[id]) {
        color = colorPallete[0];
        colorPallete.splice(0, 1);

        let name;
        for (let user in users) {
          if (users[user].id == id) name = users[user].name;
        }

        let data = {};

        labels.forEach(item => {
          data[item] = 0;
        });
        usersData[id] = {
          label: name,
          backgroundColor: "transparent",
          data: data,
          borderColor: "#" + color,
          borderWidth: 2
        };
      }

      let date = new moment(commits[projectId][commit].committed_at).format(
        "DD.MM"
      );

      usersData[id].data[date] = usersData[id].data[date]
        ? usersData[id].data[date] + 1
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
  const commits = data.commits;
  const users = data.users;
  const usersData = {};
  let color;

  if (since instanceof moment == false) {
    since = new moment(since);
  }
  let colorPallete = palette("qualitative", Object.keys(users).length);

  //We create labels by taking earliest day and adding a day on every loop

  for (var i = 0; i < 31; i++) {
    let a = since.clone();
    labels.push(a.add(i, "days").format("DD.MM"));
  }

  for (let projectId in commits) {
    for (let commit in commits[projectId]) {
      let id = commits[projectId][commit].userId;
      if (!id) continue;
      console.log(commits[projectId][commit]);
      if (!usersData[id]) {
        color = colorPallete[0];
        colorPallete.splice(0, 1);

        let name;
        for (let user in users) {
          if (users[user].id == id) name = users[user].name;
        }

        let data = {};

        labels.forEach(item => {
          data[item] = 0;
        });
        usersData[id] = {
          label: name,
          backgroundColor: "transparent",
          data: data,
          borderColor: "#" + color,
          borderWidth: 2
        };
      }

      let date = new moment(commits[projectId][commit].committed_at).format(
        "DD.MM"
      );

      usersData[id].data[date] = usersData[id].data[date]
        ? usersData[id].data[date] + 1
        : 1;
    }
  }

  for (let user in usersData) {
    usersData[user].data = Object.values(usersData[user].data);
  }

  return { labels, datasets: Object.values(usersData) };
};

const parse90Days = (data, since) => {
  const labels = [];
  const periods = [];
  let datasets = [];
  const commits = data.commits;
  const users = data.users;
  const usersData = {};
  let color;
  let periodSince;

  if (since instanceof moment == false) {
    since = new moment(since);
  }

  let colorPallete = palette("qualitative", Object.keys(users).length);

  //We create labels by taking earliest day and adding a day on every loop

  for (var i = 1; i < 14; i++) {
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

  for (let projectId in commits) {
    for (let commit in commits[projectId]) {
      let id = commits[projectId][commit].userId;
      if (!id) continue;

      if (!usersData[id]) {
        color = colorPallete[0];
        colorPallete.splice(0, 1);

        let name;
        for (let user in users) {
          if (users[user].id == id) name = users[user].name;
        }

        let data = {};

        labels.forEach(item => {
          data[item] = 0;
        });
        usersData[id] = {
          label: name,
          backgroundColor: "transparent",
          data: data,
          borderColor: "#" + color,
          borderWidth: 2
        };
      }

      let date = new moment(commits[projectId][commit].committed_at);
      periods.forEach((period, i) => {
        let parts = period.split(" - ");

        let start = new moment(parts[0]);
        let end = new moment(parts[1]);

        if (date.isBetween(start, end)) {
          usersData[id].data[labels[i]] = usersData[id].data[labels[i]]
            ? usersData[id].data[labels[i]] + 1
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

const parseYear = (data, since) => {
  let labels = [];
  let datasets = [];
  const commits = data.commits;
  const users = data.users;
  const usersData = {};
  let color;

  if (since instanceof moment == false) {
    since = new moment(since);
  }
  let colorPallete = palette("qualitative", Object.keys(users).length);

  //We create labels by taking earliest day and adding a day on every loop

  for (var i = 0; i < 52; i++) {
    labels.push(
      since.format("DD.MM") + " - " + since.add(1, "w").format("DD.MM")
    );
  }

  for (let projectId in commits) {
    for (let commit in commits[projectId]) {
      let id = commits[projectId][commit].userId;
      if (!id) continue;

      if (!usersData[id]) {
        color = colorPallete[0];
        colorPallete.splice(0, 1);

        let name;
        for (let user in users) {
          if (users[user].id == id) name = users[user].name;
        }

        let data = {};

        labels.forEach(item => {
          data[item] = 0;
        });
        usersData[id] = {
          label: name,
          backgroundColor: "transparent",
          data: data,
          borderColor: "#" + color,
          borderWidth: 2
        };
      }

      let date = new moment(commits[projectId][commit].committed_at).format(
        "DD.MM"
      );

      usersData[id].data[date] = usersData[id].data[date]
        ? usersData[id].data[date] + 1
        : 1;
    }
  }

  for (let user in usersData) {
    usersData[user].data = Object.values(usersData[user].data);
  }

  return { labels, datasets: Object.values(usersData) };
};
