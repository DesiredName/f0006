const generate_48h_datas = () => {
  const data = [];
  const delta = 60 * 60 * 1000;
  
  let today = new Date();
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  today = today.getTime();

  for (let hour = 49; hour >= 0; hour--) {
    const timestamp = new Date(today - delta * hour);
    const views = Math.round(Math.random() * 3);

    data.push({ timestamp, views });
  }

  return data.toSorted((a, b) => a[0] > b[0] ? 1 : -1);
}

const generate_main_datas = () => {
  const data = [];
  const delta = 24 * 60 * 60 * 1000;
  let today = new Date();
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  today = today.getTime();

  for (let day = 800; day >= 0; day--) {
    const timestamp = new Date(today - (delta * day));
    const views = Math.random() > .6 ?  Math.round(Math.random() * 10000) : Math.round(Math.random() * 10);
    const watch = Math.random() * views;
    const subscribers = Math.round(Math.random() * watch) * (Math.random() > 0.4 ? -1 : 1);
    const revenue = subscribers > 0 ? Math.random() : 0;

    data.push({ timestamp, views, watch, subscribers, revenue });
  }

  return data.toSorted((a, b) => a[0] > b[0] ? 1 : -1);
}

export const samples_48h = generate_48h_datas();
export const samples_main = generate_main_datas();