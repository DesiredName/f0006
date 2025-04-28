import { chart_datas_target, compute_DateRange, view_option } from "./utils.js"

export default function ComposeData(target, { data }, date_range_option) {
    if (target === chart_datas_target.ChartMain) {
        return ComposeDataForChartMain(data, date_range_option);
    } else if (target === chart_datas_target.Chart48H) {
        return ComposeDataForChart48H(data);
    } else {
        alert('Target unknown');
    }
}

function ComposeDataForChart48H(datas) {
    const today = new Date();
    today.setUTCHours(0, 0 ,0, 0);
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

function ComposeDataForChartMain(datas, selected_date_range_option) {
    const range = compute_DateRange(selected_date_range_option);
    const main_datas = datas.filter(({ timestamp }) => (timestamp >= range.curr_from) && (timestamp <= range.curr_till));

    return {
        [view_option.VIEWS]: {
            figure: '112',
            trend: null,
            details: '8% less than previous 7 days',
            data: main_datas.map((entry) => ({
                x: entry.timestamp,
                y: entry.views,
            })),
        },
        [view_option.WATCH]: {
            figure: '4.1',
            trend: 'up',
            details: '14% more than previous 7 days',
            data: main_datas.map((entry) => ({
                x: entry.timestamp,
                y: entry.watch,
            })),
        },
        [view_option.SUBS]: {
            figure: '-4',
            trend: 'down',
            details: '200% more than previous 7 days',
            data: main_datas.map((entry) => ({
                x: entry.timestamp,
                y: entry.subscribers,
            })),
        },
        [view_option.REV]: {
            figure: '$0.12',
            trend: 'up',
            details: '32% more than previous 7 days',
            data: main_datas.map((entry) => ({
                x: entry.timestamp,
                y: entry.revenue,
            })),
        }
    };
}