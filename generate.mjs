import fs from 'node:fs';

const data = [];
const today = new Date().getTime();

const randomDays = () => (Math.floor(Math.random() * 365 * 3) * 24 * 3600000);
const randomMills = () => (Math.floor(Math.random() * 3600000));

for(let i = 0; i < 10000; i++) {
    const timestamp = new Date(today - randomDays() - randomMills());
    const sessions = Math.round(Math.random() * 200);
    const orders = Math.round(Math.random() * sessions);
    const totalSales = Math.round(Math.random() * orders);

    data.push([timestamp, sessions, orders, totalSales]);
}

const samples = data.toSorted((a, b) => a[0] > b[0] ? 1 : -1).map(([timestamp, ...a]) => [timestamp.toISOString(), ...a].join(',')).join('\n');
const output = 'timestamp,sessions,orders,totalSales\n'.concat(samples);

fs.writeFileSync('./public/sample.csv', output);