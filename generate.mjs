import fs from 'node:fs';
import { generator_options } from './samples.js';

// main datas
{
    const data = [];
    const delta = 24 * 60 * 60 * 1000;

    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    today = today.getTime();

    const p = (base, jagger) => base + jagger * (base * Math.random() * (Math.random() > 0.5 ? -1 : 1));

    for (let day = 800; day >= 0; day--) {
        const timestamp = new Date(today - (delta * day));

        const views = Math.floor(
            p(generator_options.views.amount, generator_options.views.jagger)
        );

        const videos = Math.random() > .8 ? 1 : Math.random() > .85 ? 2 : 0;

        data.push({ timestamp, views, videos });
    }

    const samples = data
        .toSorted((a, b) => a[0] > b[0] ? 1 : -1)
        .map((obj) => [obj.timestamp.toISOString(), obj.views, obj.videos].join(','))
        .join('\n');
    const output = 'timestamp,views,videos\n'.concat(samples);

    fs.writeFileSync('./main.csv', output);
}

// views 48h
{
    const data = [];
    const delta = 60 * 60 * 1000;

    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);
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

    const samples = data
        .toSorted((a, b) => a[0] > b[0] ? 1 : -1)
        .map((obj) => [obj.timestamp.toISOString(), obj.views].join(','))
        .join('\n');
    const output = 'timestamp,views\n'.concat(samples);

    fs.writeFileSync('./views.csv', output);
}