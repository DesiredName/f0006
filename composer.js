import { compute_DateRange, compute_PercentFormatted, date_range_option, view_option } from "./utils.js"

export function ComposeDataForChart48H(datas) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
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

export function ComposeDataForChartMain(datas, selected_date_range_option, selected_view_option) {
    const range = compute_DateRange(selected_date_range_option);
    const noPreviousRange = selected_date_range_option === date_range_option.LIFE;
    const main_datas = datas.filter(({ timestamp }) => (timestamp > range.curr_from) && (timestamp <= range.curr_till));
    const compared_datas = noPreviousRange
        ? null
        : datas.filter(({ timestamp }) => (timestamp > range.prev_from) && (timestamp <= range.prev_till));

    const compute_trend = (figure, prev_figure) => noPreviousRange ? null : figure > prev_figure ? 'up' : figure < prev_figure ? 'down' : null;
    const main_title = ((t) => {
        const f = new Intl.NumberFormat('en', {
            style: 'decimal'
        });

        return range.range_title(f.format(t));
    })(main_datas.reduce((acc, entry) => acc + entry.views, 0));

    return {
        main_title,

        [view_option.VIEWS]: ((compute_data, prop_name, figure, prev_figure) => {
            const trend = compute_trend(figure, prev_figure);
            const percent = noPreviousRange ? 0 : compute_PercentFormatted((figure - prev_figure) / prev_figure);
            const details = (noPreviousRange || trend == null)
                ? ''
                : percent == null
                    ? 'About the same as previous ' + range.range_name : ((trend === 'up'
                        ? percent + ' more than last '
                        : percent + ' less than last ') + range.range_name);

            const f = new Intl.NumberFormat('en', {
                notation: 'compact',
                compactDisplay: 'short',
            });

            return {
                figure: figure === 0 ? '-' : f.format(figure),
                trend,
                details,
                yAxisFormatter: function () { return f.format(this.value); },
                data: compute_data ? main_datas.map((entry) => ({
                    x: entry.timestamp,
                    y: entry[prop_name],
                    t: f.format(entry[prop_name]),
                })) : [],
            }
        })(
            selected_view_option === view_option.VIEWS,
            'views',
            main_datas.reduce((acc, entry) => acc + entry.views, 0),
            noPreviousRange ? [] : compared_datas.reduce((acc, entry) => acc + entry.views, 0)
        ),

        [view_option.WATCH]: ((compute_data, prop_name, figure, prev_figure) => {
            const trend = compute_trend(figure, prev_figure);
            const percent = noPreviousRange ? 0 : compute_PercentFormatted((figure - prev_figure) / prev_figure);
            const details = (noPreviousRange || trend == null)
                ? ''
                : percent == null
                    ? 'About the same as previous ' + range.range_name : ((trend === 'up'
                        ? percent + ' more than last '
                        : percent + ' less than last ') + range.range_name);

            return {
                figure: figure === 0 ? '-' : figure.toFixed(2),
                trend,
                details,
                yAxisFormatter: undefined,
                data: compute_data ? main_datas.map((entry) => ({
                    x: entry.timestamp,
                    y: entry[prop_name],
                    t: entry[prop_name],
                })) : [],
            }
        })(
            selected_view_option === view_option.WATCH,
            'watch',
            main_datas.reduce((acc, entry) => acc + entry.watch, 0),
            noPreviousRange ? [] : compared_datas.reduce((acc, entry) => acc + entry.watch, 0)
        ),

        [view_option.SUBS]: ((compute_data, prop_name, figure, prev_figure) => {
            const trend = compute_trend(figure, prev_figure);
            const percent = noPreviousRange ? 0 : compute_PercentFormatted((figure - prev_figure) / prev_figure);
            const details = (noPreviousRange || trend == null)
                ? ''
                : percent == null
                    ? 'About the same as previous ' + range.range_name : ((trend === 'up'
                        ? percent + ' more than last '
                        : percent + ' less than last ') + range.range_name);

            const f = new Intl.NumberFormat('en', {
                notation: 'compact',
                compactDisplay: 'short',
                signDisplay: 'always'
            });

            return {
                figure: figure === 0 ? '-' : f.format(figure),
                trend,
                details,
                yAxisFormatter: function () { return f.format(this.value); },
                data: compute_data ? main_datas.map((entry) => ({
                    x: entry.timestamp,
                    y: entry[prop_name],
                    t: f.format(entry[prop_name]),
                })) : [],
            }
        })(
            selected_view_option === view_option.SUBS,
            'subscribers',
            main_datas.reduce((acc, entry) => acc + entry.subscribers, 0),
            noPreviousRange ? [] : compared_datas.reduce((acc, entry) => acc + entry.subscribers, 0)
        ),

        [view_option.REV]: ((compute_data, prop_name, figure, prev_figure) => {
            const trend = compute_trend(figure, prev_figure);
            const percent = noPreviousRange ? 0 : compute_PercentFormatted((figure - prev_figure) / prev_figure);
            const details = (noPreviousRange || trend == null)
                ? ''
                : percent == null
                    ? 'About the same as previous ' + range.range_name : ((trend === 'up'
                        ? percent + ' more than last '
                        : percent + ' less than last ') + range.range_name);

            const f = new Intl.NumberFormat('en', {
                style: 'currency',
                notation: 'compact',
                compactDisplay: 'short',
                currencySign: 'standard',
                currencyDisplay: 'symbol',
                currency: 'USD',
                maximumFractionDigits: 2,
            });

            return {
                figure: figure === 0 ? '-' : f.format(figure),
                trend,
                details,
                yAxisFormatter: function () { return f.format(this.value); },
                data: compute_data ? main_datas.map((entry) => ({
                    x: entry.timestamp,
                    y: entry[prop_name],
                    t: f.format(entry[prop_name]),
                })) : [],
            }
        })(
            selected_view_option === view_option.REV,
            'revenue',
            main_datas.reduce((acc, entry) => acc + entry.revenue, 0),
            noPreviousRange ? [] : compared_datas.reduce((acc, entry) => acc + entry.revenue, 0)
        ),
    };
}