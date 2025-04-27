import { data_target } from "./utils.js"

export default function ComposeData(target, { data }, date_range_option) {
    if (target === data_target.ChartMain) {
        return ComposeDataForChartMain(data, date_range_option);
    } else if (target === data_target.Chart48H) {
        return ComposeDataForChart48H(data);
    } else {
        alert('Target unknown');
    }
}

function ComposeDataForChartMain(data, date_range_option) {
    console.log(date_range_option)
}

function ComposeDataForChart48H(datas) {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(1);
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    const f = new Intl.DateTimeFormat('en', {
        hour: 'numeric',
        minute: '2-digit',
    });
    const d = new Intl.DateTimeFormat('en', {
        month: undefined,
        year: undefined,
        weekday: 'long'
    });

    const isToday = (date) => date >= today;
    const isYesterday = (date) => date >= yesterday && date < today;
    const format = (date) => {
        const time_part = f.format(date) + ' - ' + f.format(date.getTime() - 3600000);

        if (isToday(date)) {
            return 'Today, ' + time_part;
        } else if (isYesterday(date)) {
            return 'Yesterday, ' + time_part;
        } else {
            return d.format(date) + ', ' + time_part;
        }
    }

    return datas.slice(-48).map((entry, idx) => {
        return {
            x: idx,
            y: Number(entry.views),
            custom: { title: format(new Date(entry.timestamp)) }
        }
    });
};