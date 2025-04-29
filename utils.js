// ENUMS
export const date_range_option = Object.freeze({
    L7D: 'l7d',
    L28D: 'l28d',
    L90D: 'l90d',
    L365D: 'l365d',
    LIFE: 'Lifetime',

    THISY: 'THISY',
    PREVY: 'PREVY',

    THISM: 'THISM',
    PREVM: 'PREVM',
    PREVPREVM: 'PREVPREVM',
});

export const view_option = Object.freeze({
    VIEWS: 'EXTERNAL_VIEWS-tab',
    WATCH: 'EXTERNAL_WATCH_TIME-tab',
    SUBS: 'SUBSCRIBERS_NET_CHANGE-tab',
    REV: 'TOTAL_ESTIMATED_EARNINGS-tab',
});

const today = new Date();
const this_month = today;
const prev_month = new Date(today.getFullYear(), today.getMonth(), 0);
const prev_prev_month = new Date(prev_month.getFullYear(), prev_month.getMonth(), 0);
const mf = new Intl.DateTimeFormat('en', { month: 'long' })
export const date_range = Object.freeze({
    [date_range_option.L7D]: 'Last 7 days',
    [date_range_option.L28D]: 'Last 28 days',
    [date_range_option.L90D]: 'Last 90 days',
    [date_range_option.L365D]: 'Last 365 days',
    [date_range_option.LIFE]: 'Lifetime',
    [date_range_option.THISY]: today.getFullYear(),
    [date_range_option.PREVY]: today.getFullYear() - 1,

    [date_range_option.THISM]: mf.format(this_month),
    [date_range_option.PREVM]: mf.format(prev_month),
    [date_range_option.PREVPREVM]: mf.format(prev_prev_month),
});

export const chart_datas_target = Object.freeze({
    ChartMain: 'target-chart-1',
    Chart48H: 'target-chart-2',
});
// -------------------------------------------------------------------------

// VALES
export class DateRange {
    constructor(range_title, range_name, curr_from, curr_till, prev_from, prev_till) {
        this.range_title = range_title;
        this.range_name = range_name;
        this.curr_from = curr_from;
        this.curr_from.setUTCHours(0, 0, 0, 0);
        this.curr_till = curr_till;
        this.curr_till.setUTCHours(23, 59, 59, 999);
        this.prev_from = prev_from;
        this.prev_from?.setUTCHours(0, 0, 0, 0);
        this.prev_till = prev_till;
        this.prev_till?.setUTCHours(23, 59, 59, 999);
    }
}

export const compute_DateRange = (option) => {
    const day = 24 * 60 * 60 * 1000;

    const curr = new Date(Date.now() - day);
    curr.setUTCHours(0, 0, 0, 0);
    const now = curr.getTime();

    let result;

    switch (option) {
        case date_range_option.L28D:
            result = new DateRange(
                (v) => `Your channel got ${v} views in the last 28 days`,
                'last 28 days',
                new Date(now - 27 * day),
                curr,
                new Date(now - (27 * 2 + 1) * day),
                new Date(now - (27 + 1) * day),
            );
            break;

        case date_range_option.L90D:
            result = new DateRange(
                (v) => `Your channel got ${v} views in the last 90 days`,
                'last 90 days',
                new Date(now - 89 * day),
                curr,
                new Date(now - (89 * 2 + 1) * day),
                new Date(now - (89 + 1) * day),
            );
            break;

        case date_range_option.L365D:
            result = new DateRange(
                (v) => `Your channel got ${v} views in the last 365 days`,
                'last 365 days',
                new Date(now - 364 * day),
                curr,
                new Date(now - (364 * 2 + 1) * day),
                new Date(now - (364 + 1) * day),
            );
            break;

        case date_range_option.LIFE:
            result = new DateRange(
                v => `Your channel has gotten ${v} views so far`,
                null,
                new Date(2023, 3, 19, 0, 0, 0, 0), // 19 Apr 2023
                curr,
                null,
                null,
            );
            break;

        case date_range_option.THISY: {
            const number_of_days_since_this_year = Math.floor(
                curr.getTime() - new Date(curr.getFullYear(), 0, 1).getTime()
            );
            const prev_from = new Date(new Date(curr.getFullYear(), 0, 0).getTime() - number_of_days_since_this_year);
            const prev_till = new Date(curr.getFullYear(), 0, 0)

            const f1 = new Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
            });
            const f2 = new Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            result = new DateRange(
                (v) => `Your channel got ${v} views in ${curr.getFullYear()}`,
                f1.format(prev_from) + ' - ' + f2.format(prev_till),
                new Date(curr.getFullYear(), 0, 1),
                curr,
                prev_from,
                prev_till,
            );
            break;
        };

        case date_range_option.PREVY: {
            const prev_from = new Date(curr.getFullYear() - 2, 0, 0);
            const prev_till = new Date(curr.getFullYear() - 1, 0, 0);

            const f1 = new Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            const f2 = new Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            result = new DateRange(
                (v) => `Your channel got ${v} views in ${curr.getFullYear()}`,
                f1.format(prev_from) + ' - ' + f2.format(prev_till),
                new Date(curr.getFullYear() - 1, 0, 1),
                new Date(curr.getFullYear(), 0, 0),
                prev_from,
                prev_till,
            );
            break;
        };

        case date_range_option.THISM: {
            const number_of_days_since_this_month = Math.floor(
                curr.getTime() - new Date(curr.getFullYear(), curr.getMonth(), 1).getTime()
            );
            const prev_from = new Date(new Date(curr.getFullYear(), curr.getMonth(), 1).getTime() - number_of_days_since_this_month);
            const prev_till = new Date(curr.getFullYear(), curr.getMonth(), 0)

            const f1 = new Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            const f2 = new Intl.DateTimeFormat('en', {
                month: 'long',
            });

            result = new DateRange(
                (v) => `Your channel got ${v} views in ${f2.format(curr)}`,
                f1.formatRange(prev_from, prev_till),
                new Date(curr.getFullYear(), curr.getMonth(), 1),
                curr,
                prev_from,
                prev_till,
            );
            break;
        };

        case date_range_option.PREVM: {
            const curr_till = new Date(curr.getFullYear(), curr.getMonth(), 0);
            const curr_from = new Date(curr_till.getFullYear(), curr_till.getMonth(), 1);
            const number_of_days_since_prev_month = Math.floor(
                curr_till.getTime() - curr_from.getTime()
            );
            const prev_till = new Date(curr_from.getFullYear(), curr_from.getMonth(), 0);
            const prev_from = new Date(prev_till.getTime() - number_of_days_since_prev_month);

            const f1 = new Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            const f2 = new Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            const f3 = new Intl.DateTimeFormat('en', {
                month: 'long',
            })

            result = new DateRange(
                (v) => `Your channel got ${v} views in ${f3.format(prev_from)}`,
                f1.formatRange(prev_from, prev_till),
                curr_from,
                curr_till,
                prev_from,
                prev_till,
            );
            break;
        };

        case date_range_option.PREVPREVM: {
            let curr_till = new Date(curr.getFullYear(), curr.getMonth(), 0);
            let curr_from = new Date(curr_till.getFullYear(), curr_till.getMonth(), 1);
            curr_till = new Date(curr_till.getFullYear(), curr_till.getMonth(), 0);
            curr_from = new Date(curr_till.getFullYear(), curr_till.getMonth(), 1);
            const number_of_days_since_prev_month = Math.floor(
                curr_till.getTime() - curr_from.getTime()
            );
            const prev_till = new Date(curr_from.getFullYear(), curr_from.getMonth(), 0);
            const prev_from = new Date(prev_till.getTime() - number_of_days_since_prev_month);

            const f1 = new Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            const f2 = new Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            const f3 = new Intl.DateTimeFormat('en', {
                month: 'long',
            })

            result = new DateRange(
                (v) => `Your channel got ${v} views in ${f3.format(prev_from)}`,
                f1.formatRange(prev_from, prev_till),
                curr_from,
                curr_till,
                prev_from,
                prev_till,
            );
            break;
        };

        default:
        case date_range_option.L7D:
            result = new DateRange(
                (v) => `Your channel got ${v} views in the last 7 days`,
                'last 7 days',
                new Date(now - 6 * day),
                curr,
                new Date(now - (6 * 2 + 1) * day),
                new Date(now - (6 + 1) * day),
            );
            break;
    }

    console.dir(result)

    return result;
}
// -------------------------------------------------------------------------

// FORMATTERS
export const compute_DateRange_DaysFormatted = (option) => {
    const day = 24 * 60 * 60 * 1000;
    const now = new Date(new Date(new Date() - day).setUTCHours(0, 0, 0, 0));

    let curr = 0;
    let prev = 0;

    switch (option) {
        case date_range_option.L28D:
            curr = now;
            prev = new Date(now - 27 * day);
            break;

        case date_range_option.L90D:
            curr = now;
            prev = new Date(now - 89 * day);
            break;

        case date_range_option.L365D:
            curr = now;
            prev = new Date(now - 364 * day);
            break;

        case date_range_option.LIFE:
            curr = now;
            prev = new Date(2023, 3, 19); // 19 Apr 2023
            break;

        case date_range_option.THISY:
            curr = now;
            prev = new Date(now.getFullYear(), 0, 1);
            break;

        case date_range_option.PREVY:
            curr = new Date(now.getFullYear(), 0, 0);
            prev = new Date(now.getFullYear() - 1, 0, 1);
            break;

        case date_range_option.THISM:
            curr = now;
            prev = new Date(now.getFullYear(), now.getMonth(), 1);
            break;

        case date_range_option.PREVM:
            curr = new Date(now.getFullYear(), now.getMonth(), 0);
            prev = new Date(curr.getFullYear(), curr.getMonth(), 1);
            break;

        case date_range_option.PREVPREVM:
            curr = new Date(now.getFullYear(), now.getMonth(), 0);
            prev = new Date(curr.getFullYear(), curr.getMonth(), 0);
            curr = prev;
            prev = new Date(prev.getFullYear(), prev.getMonth(), 1);
            break;

        default:
        case date_range_option.L7D:
            curr = now;
            prev = new Date(now - 6 * day);
            break;
    }

    if (curr.getFullYear() === prev.getFullYear()) {
        if (option === date_range_option.THISY) {
            const f1 = Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
            });
            const f2 = Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            const month_prev = f1.format(prev);
            const month_curr = f2.format(curr);

            return month_prev + ' - ' + month_curr;
        } else if (option === date_range_option.PREVY) {
            const f1 = Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
            });
            const f2 = Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            const month_prev = f1.format(prev);
            const month_curr = f2.format(curr);

            return month_prev + ' - ' + month_curr;
        } else if (curr.getMonth() === prev.getMonth()) {
            const f = Intl.DateTimeFormat('en', {
                month: 'short'
            });
            const month = f.format(curr);

            return month + ' ' + prev.getDate() + ' - ' + curr.getDate() + ', ' + curr.getFullYear();
        } else {
            const f = Intl.DateTimeFormat('en', {
                day: '2-digit',
                month: 'short'
            });
            const month_curr = f.format(curr);
            const month_prev = f.format(prev);

            return month_prev + ' - ' + month_curr + ', ' + curr.getFullYear();
        }
    } else {
        const f = Intl.DateTimeFormat('en', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        const month_curr = f.format(curr);
        const month_prev = f.format(prev);

        return month_prev + ' - ' + month_curr;
    }
}

export const compute_LiveViewers_NumberFormatted = (num) => {
    const f = new Intl.NumberFormat('en', {
        style: 'decimal',
    });

    return f.format(num);
}

export const compute_PercentFormatted = (val) => {
    if (Math.abs(val) > 999) {
        return (Math.sign(val) * 999) + '%';
    } else {
        return val.toFixed(1) + '%';
    }
}
// -------------------------------------------------------------------------


// CHARTS
export const addVerticalLine = (chart, renderer) => {
    const xAxis = chart.xAxis[0];
    const verticalLine = renderer
        .path([['M', 0, 10], ['L', 0, chart.plotHeight + 10]])
        .attr({
            class: 'chart-vertical-line',
            fill: '#7e7e7e',
            stroke: '#282828',
            'stroke-width': 1,
        })
        .add();

    verticalLine.hide();

    chart.container.addEventListener('pointermove', (event) => {
        const nearest = chart.series?.[0]?.searchPoint?.(chart.pointer.normalize(event), true);
        const idx = nearest?.key;

        if (!!idx && idx >= xAxis.min && idx <= xAxis.max) {
            const plotX = xAxis.toPixels(idx);

            verticalLine.attr({
                d: [['M', plotX, 10], ['L', plotX, chart.plotHeight + 10], ['L', plotX + 2, chart.plotHeight + 10], ['L', plotX + 2, 10], ['L', plotX, 10]],
            });
            verticalLine.show();
        } else {
            verticalLine.hide();
        }
    });

    chart.container.addEventListener('mouseleave', () => {
        verticalLine.hide();
    });
}
// -------------------------------------------------------------------------