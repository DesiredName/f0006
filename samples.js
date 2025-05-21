export const generator_options = {
  views: {
    amount: 1000,
    jagger: 1,
  },
  views_to_subscribers: {
    split: 1000,
    multiplier: 25,
    jagger: 0.3,
  },
  views_to_watch: {
    split: 1,
    multiplier: 0.6,
    jagger: 1.0,
  },
  views_to_revenue: {
    split: 1000,
    multiplier: 5.6,
    jagger: 0,
  },
};

export const generate_48h_datas = (generator_options) => {
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
    const views = Math.random() > 0.95
      ? 3
      : Math.random() > 0.85
        ? 2
        : Math.random() > 0.75
          ? 1
          : 0;

    data.push({ timestamp, views });
  }

  return data.toSorted((a, b) => a[0] > b[0] ? 1 : -1);
}

export const generate_main_datas = (generator_options) => {
  const data = [];
  const delta = 24 * 60 * 60 * 1000;
  let today = new Date();
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  today = today.getTime();

  const p = (base, jagger) => base + jagger * (base * Math.random() * (Math.random() > 0.5 ? -1 : 1));
  const t = (base, split, multiplier, jagger) => {
    return p(base / split, jagger) * multiplier;
  }

  for (let day = 800; day >= 0; day--) {
    const timestamp = new Date(today - (delta * day));

    const views = Math.floor(
      p(generator_options.views.amount, generator_options.views.jagger)
    );

    const subscribers = Math.floor(t(
      views,
      generator_options.views_to_subscribers.split,
      generator_options.views_to_subscribers.multiplier,
      generator_options.views_to_subscribers.jagger,
    ));

    let revenue = t(
      views,
      generator_options.views_to_revenue.split,
      generator_options.views_to_revenue.multiplier,
      generator_options.views_to_revenue.jagger,
    );
    revenue = revenue > 0 ? revenue : 0;

    let watch = t(
      views,
      generator_options.views_to_watch.split,
      generator_options.views_to_watch.multiplier,
      generator_options.views_to_watch.jagger,
    );

    const videos = Math.random() > .8 ? 1 : Math.random() > .85 ? 2 : 0;
    
    data.push({ timestamp, views, watch, subscribers, revenue, videos });
  }

  return data.toSorted((a, b) => a[0] > b[0] ? 1 : -1);
}