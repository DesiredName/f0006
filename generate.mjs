import fs from 'node:fs';

// main datas
let data = [];
let delta = 24 * 60 * 60 * 1000;
let today = new Date();
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
today = today.getTime();

for (let day = 800; day >= 0; day--) {
    const timestamp = new Date(today - (delta * day));
    const views = Math.round(Math.random() * 10);
    const watch = (Math.random() * views).toFixed(2);
    const subscribers = Math.round(Math.random() * watch) * (Math.random() > 0.4 ? -1 : 1);
    const revenue = subscribers > 0 ? (Math.random()).toFixed(2) : 0;

    data.push([timestamp, views, watch, subscribers, revenue]);
}

let samples = data.toSorted((a, b) => a[0] > b[0] ? 1 : -1).map(([timestamp, ...a]) => [timestamp.toISOString(), ...a].join(',')).join('\n');
let output = 'timestamp,views,watch,subscribers,revenue\n'.concat(samples);

fs.writeFileSync('./main.csv', output);

// views 48h
data = [];
delta = 60 * 60 * 1000;
today = new Date();
today.setUTCHours(0);
today.setUTCMinutes(0);
today.setUTCSeconds(0);
today.setUTCMilliseconds(0);
today = today.getTime();

for (let hour = 49; hour >= 0; hour--) {
    const timestamp = new Date(today - delta * hour);
    const views = Math.round(Math.random() * 3);

    data.push([timestamp, views]);
}

samples = data.toSorted((a, b) => a[0] > b[0] ? 1 : -1).map(([timestamp, ...a]) => [timestamp.toISOString(), ...a].join(',')).join('\n');
output = 'timestamp,views\n'.concat(samples);

fs.writeFileSync('./views.csv', output);
