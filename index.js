import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'
import {
    addVerticalLine,
    date_range,
    date_range_option,
    compute_date_range_DaysFormatted,
    compute_live_viewers,
    data_target
} from './utils.js';
import ComposeData from './composer.js';
import { samples_48h } from './samples.js';

// elements
const date_range_selector_toggler_el = document.querySelector("[data-id='date_range_selector_toggler']")
const date_range_selector_el = document.querySelector("[data-id='date_range_selector']");
const chart_1_placeholder = document.querySelector("[data-id='chart-1-placeholder']");
const chart_2_placeholder = document.querySelector("[data-id='chart-2-placeholder']");
const upload_dialog = document.getElementById('uploadDialog');
const upload_dialog_file = document.getElementById('fileInput');

const view_option = Object.freeze({
    VIEWS: 'EXTERNAL_VIEWS-tab',
    WATCH: 'EXTERNAL_WATCH_TIME-tab',
    SUBS: 'SUBSCRIBERS_NET_CHANGE-tab',
    REV: 'TOTAL_ESTIMATED_EARNINGS-tab',
});

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

    chart48h: null,

    isDateSelectorVisible: false,
    selectedDateRange_DaysFormatted: compute_date_range_DaysFormatted(date_range_option.L7D),
    selectedDateRange_Title: date_range[date_range_option.L7D],

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
        this.selectedDateRangeOption = option;
        this.selectedDateRange_Title = date_range[option];
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

        SpinChartMain();
        SpinChart48H();
    },
    uploadChartMainDatas(e) {
        e.preventDefault();
        upload_dialog.dataset.target = data_target.ChartMain;
        upload_dialog.showModal();
    },
    uploadChart48HDatas(e) {
        e.preventDefault();
        upload_dialog.dataset.target = data_target.Chart48H;
        upload_dialog.showModal();
    },
}).mount('body');

// File
upload_dialog_file.addEventListener('change', (e) => {
    upload_dialog.close();

    const target = upload_dialog.dataset.target;
    const file = upload_dialog_file.files[0];

    if (!target) {
        alert('Please select a data target');
        return;
    }

    if (!file) {
        alert('Please select a file first');
        return;
    }

    Papa.parse(file, {
        header: true,
        complete: function(results) {
            if (target === data_target.Chart48H) {
                state.chart48h.update({
                    series: { data: ComposeData(target, results, state.selectedDateRangeOption) }
                });
            }
        }
    });
});

// CHARTS
function SpinChartMain() {
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

function SpinChart48H() {
    state.chart48h = Highcharts.chart(chart_2_placeholder, {
        chart: {
            type: 'column',
            backgroundColor: 'transparent',
            height: 80,
            spacingTop: 0,
            spacingLeft: 0,
            spacingBottom: 22,
            spacingRight: 0,
        },
        credits: {
            enabled: false,
        },
        title: false,
        xAxis: {
            type: 'datetime',
            labels: {
                formatter: function () {
                    if (this.isFirst) return '-48h';
                    if (this.isLast) return 'Now';
                    return '';
                },
                y: 20,
            },
            tickPositioner: function () {
                return [this.dataMin, this.dataMax];
            },
            lineColor: '#9e9e9e',
            tickWidth: 0,
            tickLength: 6,
            minPadding: 0,
            maxPadding: 0,
            startOnTick: true,
            endOnTick: true,
        },
        yAxis: {
            opposite: true,  // Places Y-axis on the right side
            tickAmount: 4,
            gridLineColor: 'transparent',
            title: false,
            labels: {
                enabled: false
            },
        },
        legend: false,
        series: [{
            data: ComposeData(data_target.Chart48H, samples_48h, state.selectedDateRangeOption),
            color: '#41b4d9',
            pointWidth: 4,
            grouping: false,
            pointPadding: 0,
            borderWidth: 0,
            states: {
                hover: {
                    color: 'rgba(65, 180, 217, 0.4)'
                }
            }
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
                return '<span class="tooltip-date">' + this.custom?.title + '</span><br/><br/><span class="tooltip-value">' + this.y + "</span>";
            }
        },
    });
}
