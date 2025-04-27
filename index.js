import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'

// elements
const date_range_selector_toggler_el = document.querySelector("[data-id='date_range_selector_toggler']")
const date_range_selector_el = document.querySelector("[data-id='date_range_selector']");
const chart_1_placeholder = document.querySelector("[data-id='chart-1-placeholder']");

const date_range_option = Object.freeze({
    L7D: 'l7d',
    L28D: 'l28d',
    L90D: 'l90d',
    LY: 'ly',
    LIFE: 'Lifetime',
    Y2025: '2025',
    Y2024: '2024',
});

const date_range = Object.freeze({
    [date_range_option.L7D]: 'Last 7 days',
    [date_range_option.L28D]: 'Last 28 days',
    [date_range_option.L90D]: 'Last 90 days',
    [date_range_option.LY]: 'Last 365 days',
    [date_range_option.LIFE]: 'Lifetime',
    [date_range_option.Y2025]: '2025',
    [date_range_option.Y2024]: '2024',
});

const view_option = Object.freeze({
    VIEWS: 'EXTERNAL_VIEWS-tab',
    WATCH: 'EXTERNAL_WATCH_TIME-tab',
    SUBS: 'SUBSCRIBERS_NET_CHANGE-tab',
    REV: 'TOTAL_ESTIMATED_EARNINGS-tab',
});

const compute_date_range_DaysFormatted = (option) => {
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

        case date_range_option.LY:
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
        if (option === date_range_option.Y2025) {
            const f1 = Intl.DateTimeFormat('en', {
                day: '2-digit',
                month: 'short',
            });
            const f2 = Intl.DateTimeFormat('en', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            const month_prev = f1.format(new Date(curr.getFullYear(), 0));
            const month_curr = f2.format(new Date(curr));

            return month_prev + ' - ' + month_curr;
        } else if (option === date_range_option.Y2024) {
            const f1 = Intl.DateTimeFormat('en', {
                day: '2-digit',
                month: 'short',
            });
            const f2 = Intl.DateTimeFormat('en', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            const month_prev = f1.format(new Date(option, 0));
            const month_curr = f2.format(new Date(option, 12, 0));

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
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const month_curr = f.format(curr);
        const month_prev = f.format(prev);

        return month_prev + ' - ' + month_curr;
    }
}

const compute_live_viewers = (num) => {
    const f = new Intl.NumberFormat('en', {
        style: 'decimal',
    });

    return f.format(num);
}

const state = reactive({
    date_range_option,
    date_range,

    view_option,
    selected_view_option: null,
    view_options_datas: {
        [view_option.VIEWS]: {
            figure: 117,
            icon: null,
            text: '8% less than previous 7 days'
        },
        [view_option.WATCH]: {
            figure: 4.1,
            icon: 'up',
            text: '14% more than previous 7 days'
        },
        [view_option.SUBS]: {
            figure: 4,
            icon: 'up',
            text: '200% more than previous 7 days'
        },
        [view_option.REV]: {
            figure: 4,
            icon: 'up',
            text: '200% more than previous 7 days'
        }
    },
    sidebar_datas: {
        live_viewers: compute_live_viewers(1734)
    },

    isDateSelectorVisible: false,
    selectedDateRange_DaysFormatted: compute_date_range_DaysFormatted(date_range_option.L7D),
    selectedDateRangeOption: date_range[date_range_option.L7D],

    toggleDateSelector() {
        this.isDateSelectorVisible = !this.isDateSelectorVisible;
        this.isDateSelectorVisible === true
            ? this.showDateSelector()
            : this.hideDateSelector();
    },
    hideDateSelector() {
        this.isDateSelectorVisible = false;
        date_range_selector_el.style.display = 'none';
    },
    showDateSelector() {
        this.isDateSelectorVisible = true;

        const box = date_range_selector_toggler_el.getBoundingClientRect();

        date_range_selector_el.style.display = 'block';
        date_range_selector_el.style.top = box.top + 'px';
        date_range_selector_el.style.left = box.left + 'px';
    },

    selectDateRangeId(option) {
        this.hideDateSelector();
        this.selectedDateRangeOption = date_range[option];
        this.selectedDateRange_DaysFormatted = compute_date_range_DaysFormatted(option)
    },

    selectChartView(option) {
        this.selected_view_option?.classList.remove('iron-selected')
        this.selected_view_option = document.getElementById(option);
        this.selected_view_option?.classList.add('iron-selected')
    },

    setLiveViewers(e) {
        e.preventDefault();

        const val = prompt('Please set number of live viewers (comma is not required)', this.sidebar_datas.live_viewers);

        if (val != null) {
            this.sidebar_datas.live_viewers = compute_live_viewers(val);
        }
    },
});
createApp({
    state,
    mounted() {
        state.hideDateSelector();
        state.selectDateRangeId(date_range_option.L7D);
        state.selectChartView(view_option.WATCH);

        SpinChart1();
    },
    uploadChart1Datas(e) {
        e.preventDefault();
        alert(10);
    },
}).mount();

// CHARTS
const addVerticalLine = (chart, renderer) => {
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

function SpinChart1() {
    Highcharts.chart(chart_1_placeholder, {
        chart: {
            type: 'area',
            backgroundColor: 'transparent',
            height: 160,
            spacingLeft: 20,
            spacingRight: 20,
            spacingBottom: 8,
            events: {
                load(event) {
                    const target = event.target;
                    const renderer = target.renderer;

                    addVerticalLine(target, renderer);
                },
            }
        },
        credits: {
            enabled: false,
        },
        title: false,
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                day: '%b %e, %Y'  // Format: "Jan 1, 2023"
            },
            labels: {
                align: 'center',
                y: 20,
                overflow: 'justify',
            },
            padding: 30,
            lineColor: '#9e9e9e',
            tickWidth: 2,
            tickLength: 6,
            minPadding: 0,
            maxPadding: 0,
            startOnTick: true,
            endOnTick: true,
        },
        yAxis: {
            opposite: true,  // Places Y-axis on the right side
            tickAmount: 4,
            gridLineColor: '#323232',
            gridLineWidth: 2,
            title: false,
            labels: {
                format: '{value:.1f}',
            },
        },
        legend: false,
        series: [{
            data: [
                [Date.UTC(2023, 3, 1), 0.7],
                [Date.UTC(2023, 3, 2), 0.8],
                [Date.UTC(2023, 3, 3), 0.5],
                [Date.UTC(2023, 3, 4), 0.6],
                [Date.UTC(2023, 3, 5), 0.6],
                [Date.UTC(2023, 3, 6), 0.5],
                [Date.UTC(2023, 3, 7), 0.3],
            ],
            color: '#41b4d9',
            lineColor: '#41b4d9',
            lineWidth: 2,
            fillColor: 'rgba(65, 180, 217, 0.1)',
        }],
        tooltip: {
            hideDelay: 0,
            outside: true,
            className: 'chart-tooltip',
            backgroundColor: 'rgb(40, 40, 40)',
            borderColor: 'rgb(61, 61, 61)',
            borderWidth: 1,
            borderRadius: 12,
            padding: 18,
            shape: 'none',
            formatter: function () {
                return '<span class="tooltip-date">' + new Date(this.x).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }) + '</span><br/><br/><span class="tooltip-value">' + this.y + "</span>";
            }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 5,
                            lineColor: '#282828',
                            lineWidth: 2,
                        },
                    },
                },
                states: {
                    inactive: {
                        opacity: 1
                    },
                    hover: {
                        enabled: true,
                        halo: { size: 4 },
                        lineWidth: 2,
                    },
                },
                pointPlacement: 'on'
            }
        },
    });
}
