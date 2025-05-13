import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'
import {
    addVerticalLine,
    date_range,
    date_range_option,
    view_option,
    compute_DateRange_DaysFormatted,
    compute_LiveViewers_NumberFormatted,
    chart_datas_target,
} from './utils.js';
import { ComposeDataForChart48H, ComposeDataForChartMain } from './composer.js';
import { samples_48h, samples_main } from './samples.js';
import TrendIcon from './TrendIcon.js';

// elements
const date_range_selector_toggler_el = document.querySelector("[data-id='date_range_selector_toggler']")
const date_range_selector_el = document.querySelector("[data-id='date_range_selector']");
const chart_1_placeholder = document.querySelector("[data-id='chart-1-placeholder']");
const chart_2_placeholder = document.querySelector("[data-id='chart-2-placeholder']");
const state_properties_dialog = document.getElementById('statePropertiesDialog');
const aspect_ratio_container_main_chart = document.getElementById('aspect-ratio-four-one-container');

// const
const XAXIS_OFFSET = 102;
const XAXIS_LIGHT_COLOR = '#9e9e9e';
const XAXIS_DARK_COLOR = '#4c4c4c';
const MAIN_CHART_NORMAL_HEIGHT = 156;
const MAIN_CHART_FULL_HEIGHT = 189;
const ASPECT_RATION_CONTAINER_NORMAL_HEIGHT = 168;
const ASPECT_RATION_CONTAINER_FULL_HEIGHT = 204;
const ASPECT_RATION_CONTAINER_NORMAL_MARGIN = 22;
const ASPECT_RATION_CONTAINER_FULL_MARGIN = 22;

let raw_main_datas = samples_main;

const state = reactive({
    date_range_option,
    date_range,
    view_option,

    // 
    selected_date_range_option: date_range_option.L7D,
    selected_view_option: view_option.VIEWS,
    selected_view_option_el: null,

    //
    view_options_datas: {
        main_title: '',
        has_videos: false,

        videos_label_datas: {
            data: []
        },

        [view_option.VIEWS]: {
            figure: '112',
            trend: null,
            yAxisFormatter: undefined,
            details: '8% less than previous 7 days',
            data: [],
        },
        [view_option.WATCH]: {
            figure: '4.1',
            trend: 'up',
            yAxisFormatter: undefined,
            details: '14% more than previous 7 days',
            data: [],
        },
        [view_option.SUBS]: {
            figure: '-4',
            trend: 'down',
            yAxisFormatter: undefined,
            details: '200% more than previous 7 days',
            data: [],
        },
        [view_option.REV]: {
            figure: '$0.12',
            trend: 'up',
            yAxisFormatter: undefined,
            details: '32% more than previous 7 days',
            data: [],
        }
    },
    sidebar_datas: {
        live_viewers: 1734,
        live_viewers_formatted: compute_LiveViewers_NumberFormatted(1734),
        live_views: 0,
        top_content: [{
            title: 'how to glow up asap in 2025 (no bs full guide)',
            image: '/data/mqdefault.jpg',
            views: '9',
            viewsFormatted: compute_LiveViewers_NumberFormatted(9),
        }, {
            title: 'I Tried Looksmaxing For 1 Year (INSANE RESULTS)',
            image: '/data/mqdefault.jpg',
            views: '4',
            viewsFormatted: compute_LiveViewers_NumberFormatted(4),
        }, {
            title: 'how to smell good ASAP as a man (no bs guide)',
            image: '/data/mqdefault.webp',
            views: '4',
            viewsFormatted: compute_LiveViewers_NumberFormatted(4),
        }]
    },
    misc_datas: {
        channel_name: 'Ascend Looks',
        channel_image: 'https://yt3.ggpht.com/B12N4NdzcLO3dPBqce49f-kStqCVCTKrylZoXvGPEz4FoumrhyGw0iyGS4Z9C0jiUXY_RceW2iY=s176-c-k-c0x00ffffff-no-rj',
    },

    chartMain: null,
    chart48h: null,

    isDateSelectorVisible: false,
    selectedDateRange_DaysFormatted: compute_DateRange_DaysFormatted(date_range_option.L7D),
    selectedDateRange_Title: date_range[date_range_option.L7D],

    toggleDateSelector() {
        const timeout = (this.isDateSelectorVisible === false) ? 150 : 0;
        setTimeout(() => {
            this.isDateSelectorVisible = !this.isDateSelectorVisible;
            this.isDateSelectorVisible === true
                ? this.showDateSelector()
                : this.hideDateSelector();
        }, timeout);
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

    selectDateRangeId(option, updateChart = true) {
        this.hideDateSelector();

        this.selected_date_range_option = option;

        this.selectedDateRange_Title = date_range[option];
        this.selectedDateRange_DaysFormatted = compute_DateRange_DaysFormatted(option);

        this.view_options_datas = ComposeDataForChartMain(raw_main_datas, option, this.selected_view_option);

        if (updateChart === true) {
            this.setMainChartSeries(this.view_options_datas[this.selected_view_option]);
        }
    },

    selectChartView(option, updateChart = true) {
        this.selected_view_option_el?.classList.remove('iron-selected');
        this.selected_view_option_el = document.getElementById(option);
        this.selected_view_option_el?.classList.add('iron-selected');

        this.selected_view_option = option;
        this.view_options_datas = ComposeDataForChartMain(raw_main_datas, this.selected_date_range_option, option);

        if (updateChart === true) {
            this.setMainChartSeries(this.view_options_datas[option]);
        }
    },

    setLiveViewers(e) {
        const val = e.target.value;
        if (val != null) {
            this.sidebar_datas.live_viewers_formatted = compute_LiveViewers_NumberFormatted(val);
        }
    },
    
    setTopEntryImage(e, idx) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            this.sidebar_datas.top_content[idx].image = reader.result;
        }

        reader.readAsDataURL(file);
    },

    setTopEntryViews(e, idx) {
        const val = e.target.value;
        this.sidebar_datas.top_content[idx].views = val;
        this.sidebar_datas.top_content[idx].viewsFormatted = compute_LiveViewers_NumberFormatted(val);
    },

    setMainChartSeries(datas) {
        const has_videos = this.view_options_datas.has_videos;

        this.chartMain.update({
            chart: {
                height: has_videos ? MAIN_CHART_FULL_HEIGHT : MAIN_CHART_NORMAL_HEIGHT,
            },
            xAxis: [{
                lineColor: has_videos ? XAXIS_LIGHT_COLOR : 'transparent'
            }, {
                lineColor: has_videos ? XAXIS_DARK_COLOR : XAXIS_LIGHT_COLOR,
                lineWidth: has_videos ? 2 : 1,
                height: has_videos ? XAXIS_OFFSET : undefined,
            }],
            yAxis: {
                labels: {
                    formatter: datas.yAxisFormatter
                }
            },
            series: has_videos ? [
                { xAxis: 0, data: this.view_options_datas.videos_label_datas.data },
                { xAxis: 1, data: datas.data },
            ] : [
                { xAxis: 0, data: [] },
                { xAxis: 1, data: datas.data },
            ]
        });

        aspect_ratio_container_main_chart.style.height = (has_videos
            ? ASPECT_RATION_CONTAINER_FULL_HEIGHT
            : ASPECT_RATION_CONTAINER_NORMAL_HEIGHT) + 'px';

        aspect_ratio_container_main_chart.style.marginTop = (has_videos
            ? ASPECT_RATION_CONTAINER_FULL_MARGIN
            : ASPECT_RATION_CONTAINER_NORMAL_MARGIN) + 'px';
    },

    set48HChartSeries(data) {
        this.sidebar_datas.live_views = data.reduce((acc, { y }) => acc + y, 0);
        this.chart48h.update({
            series: [{ data }]
        });
    },
});

createApp({
    // state
    state,
    // components
    TrendIcon,
    // core
    mounted() {
        state.hideDateSelector();

        Highcharts.AST.bypassHTMLFiltering = true;

        setTimeout(() => {
            SpinChartMain();
            SpinChart48H();

            state.selectDateRangeId(date_range_option.L7D, false);
            state.selectChartView(view_option.VIEWS, false);

            setTimeout(() => {
                state.setMainChartSeries(state.view_options_datas[view_option.VIEWS]);
                state.set48HChartSeries(ComposeDataForChart48H(samples_48h));
            }, 1000);
        }, 1000);
    },
    uploadChartMainDatas(e) {
        e.preventDefault();
        readAndAssignChartDatas(e.target.files[0], chart_datas_target.ChartMain);
    },
    uploadChart48HDatas(e) {
        e.preventDefault();
        readAndAssignChartDatas(e.target.files[0], chart_datas_target.Chart48H);
    },
    uploadChannelImage(e) {
        e.preventDefault();
        readAndAssignChannelImage(e.target.files[0]);
    },
    showStateEditor(e) {
        e.preventDefault();
        state_properties_dialog.showModal();
    },
    hideStateEditor(e) {
        e.preventDefault();
        state_properties_dialog.close();
    }
}).mount('body');

// File
function readAndAssignChartDatas(file, target) {
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
        dynamicTyping: true,
        complete: function ({ data }) {
            if (target === chart_datas_target.Chart48H) {
                state.set48HChartSeries(ComposeDataForChart48H(data));
            }

            if (target === chart_datas_target.ChartMain) {
                raw_main_datas = Object.freeze(data);
                state.selectDateRangeId(state.selected_date_range_option);
            }
        }
    });
};

function readAndAssignChannelImage(file) {
    if (!file) {
        alert('Please select a file first');
        return;
    }

    const reader = new FileReader();

    reader.onloadend = (e) => {
        state.misc_datas.channel_image = reader.result;
    };

    reader.readAsDataURL(file);
}

// CHARTS
function SpinChartMain() {
    state.chartMain = Highcharts.chart(chart_1_placeholder, {
        chart: {
            animation: false,
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
        xAxis: [{
            type: 'datetime',
            lineColor: '#9e9e9e',
            minPadding: 0,
            maxPadding: 0,
            startOnTick: true,
            endOnTick: true,
            tickLength: 0,
            tickInterval: 86400000,
            labels: {
                distance: 7,
                allowOverlap: true,
                autoRotation: undefined,
                useHTML: true,
                formatter: function () {
                    const xVal = this.value;
                    const series = state.view_options_datas.videos_label_datas.data;
                    const point = series.find(p => p.x.getTime() == xVal);
                    const number_of_videos = point?.v ?? 0;

                    if (point == null || number_of_videos <= 0) {
                        return `<span class="video_marker empty">0</span>`;
                    } else if (number_of_videos === 1) {
                        return `<span class="video_marker single">&#11208;</span>`;
                    } else {
                        return `<span class="video_marker">${number_of_videos}</span>`;
                    }
                },
                style: {
                    textOverflow: 'none' // Adds "..." if text is too long
                },
            },
        }, {
            type: 'datetime',
            labels: {
                align: 'center',
                y: 20,
                overflow: 'justify',
                padding: 0,
                format: '{value:%b %e, %Y}',  // Format: "Jan 1, 2023"
                useHTML: true,
            },
            lineColor: '#4c4c4c',
            lineWidth: 2,
            tickWidth: 2,
            tickLength: 6,
            height: XAXIS_OFFSET,
            tickPositioner: function (min, max) {
                const positions = [];
                const step = Math.ceil((max - min) / 6); // ~5 labels
                for (let i = min; i <= max; i += step) {
                    positions.push(i);
                }
                return positions;
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: true,
            endOnTick: true,
        }],
        yAxis: {
            opposite: true,  // Places Y-axis on the right side
            tickAmount: 4,
            gridLineColor: '#323232',
            gridLineWidth: 2,
            title: false,
        },
        legend: false,
        series: [{
            xAxis: 0,
            type: 'scatter',
            data: [],
            color: '#41b4d9',
            lineColor: 'transparent',
            lineWidth: 0,
            fillColor: 'transparent',
            enableMouseTracking: false,
        }, {
            xAxis: 1,
            data: [],
            color: '#41b4d9',
            lineColor: '#41b4d9',
            lineWidth: 2,
            fillColor: 'rgba(65, 180, 217, 0.1)',
            marker: {
                symbol: 'circle'
            }
        }],
        tooltip: {
            animation: false,
            outside: true,
            backgroundColor: 'rgb(40, 40, 40)',
            borderColor: 'rgb(61, 61, 61)',
            borderWidth: 1,
            borderRadius: 12,
            padding: 18,
            shape: 'none',
            shadow: false,
            style: {
                textShadow: 'none'
            },
            formatter: function () {
                return '<span class="tooltip-date">' + new Date(this.x).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }) + '</span><br/><br/><span class="tooltip-value">' + (this.t ?? this.y) + "</span>";
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
            data: [],
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
            animation: false,
            outside: true,
            backgroundColor: 'rgb(40, 40, 40)',
            borderColor: 'rgb(61, 61, 61)',
            borderWidth: 1,
            borderRadius: 12,
            padding: 18,
            shape: 'none',
            shadow: false,
            style: {
                textShadow: 'none'
            },
            formatter: function () {
                return '<span class="tooltip-date">' + this.custom?.title + '</span><br/><br/><span class="tooltip-value">' + this.y + "</span>";
            }
        },
    });
}
