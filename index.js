import { createApp, reactive } from 'https://unpkg.com/petite-vue?module'

// elements
const date_range_selector_toggler_el = document.querySelector("[data-id='date_range_selector_toggler']")
const date_range_selector_el = document.querySelector("[data-id='date_range_selector']");

const date_range_option = Object.freeze({
    L7D: 'l7d',
    L28D: 'l28d',
    L90D: 'l90d',
    LY: 'ly',
    LIFE: 'Lifetime',
});

const date_range = Object.freeze({
    [date_range_option.L7D]: 'Last 7 days',
    [date_range_option.L28D]: 'Last 28 days',
    [date_range_option.L90D]: 'Last 90 days',
    [date_range_option.LY]: 'Last 365 days',
    [date_range_option.LIFE]: 'Lifetime',
});

const compute_date_range_DaysFormatted = (option) => {
    const day = 24 * 60 * 60 * 1000;
    const now = Date.now() - day;

    const curr = new Date(now);
    let prev = 0;

    switch (option) {
        default:
        case date_range_option.L7D:
            prev = new Date(now - 6 * day);
            break;

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
    }

    if (curr.getFullYear() === prev.getFullYear()) {
        if (curr.getMonth() === prev.getMonth()) {
            const f = Intl.DateTimeFormat(undefined, {
                month: 'short'
            });
            const month = f.format(curr);

            return month + ' ' + prev.getDate() + ' - ' + curr.getDate() + ', ' + curr.getFullYear();
        } else {
            const f = Intl.DateTimeFormat(undefined, {
                day: '2-digit',
                month: 'short'
            });
            const month_curr = f.format(curr);
            const month_prev = f.format(prev);

            return month_prev + ' - ' + month_curr + ', ' + curr.getFullYear();
        }
    } else {
        const f = Intl.DateTimeFormat(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const month_curr = f.format(curr);
        const month_prev = f.format(prev);

        return month_prev + ' - ' + month_curr;
    }
}

const state = reactive({
    date_range_option,
    date_range,

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
    }
});


createApp({
    state,
    mounted() {
        state.hideDateSelector();
    }
}).mount();
