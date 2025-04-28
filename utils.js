// ENUMS
export const date_range_option = Object.freeze({
    L7D: 'l7d',
    L28D: 'l28d',
    L90D: 'l90d',
    L365D: 'l365d',
    LIFE: 'Lifetime',
    THISY: 'THISY',
    LASTY: 'LASTY',
});

const today = new Date();
export const date_range = Object.freeze({
    [date_range_option.L7D]: 'Last 7 days',
    [date_range_option.L28D]: 'Last 28 days',
    [date_range_option.L90D]: 'Last 90 days',
    [date_range_option.L365D]: 'Last 365 days',
    [date_range_option.LIFE]: 'Lifetime',
    [date_range_option.THISY]: today.getFullYear(),
    [date_range_option.LASTY]: today.getFullYear() - 1,
});

export const chart_datas_target = Object.freeze({
    ChartMain: 'target-chart-1',
    Chart48H: 'target-chart-2',
});
// -------------------------------------------------------------------------

// FORMATTERS
export const compute_DateRange_DaysFormatted = (option) => {
    const day = 24 * 60 * 60 * 1000;
    const now = Date.now() - day;

    const curr = new Date(now);
    let prev = 0;

    switch (option) {
        case date_range_option.L28D:
            prev = new Date(now - 27 * day);
            break;

        case date_range_option.L90D:
            prev = new Date(now - 89 * day);
            break;

        case date_range_option.L365D:
            prev = new Date(now - 364 * day);
            break;

        case date_range_option.LIFE:
            prev = new Date(2023, 3, 19); // 19 Apr 2023
            break;

        default:
        case date_range_option.L7D:
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

            const month_prev = f1.format(new Date(curr.getFullYear(), 0));
            const month_curr = f2.format(new Date(curr));

            return month_prev + ' - ' + month_curr;
        } else if (option === date_range_option.LASTY) {
            const f1 = Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
            });
            const f2 = Intl.DateTimeFormat('en', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            const last_year = curr.getFullYear() - 1;
            const month_prev = f1.format(new Date(last_year, 0));
            const month_curr = f2.format(new Date(last_year, 12, 0));

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