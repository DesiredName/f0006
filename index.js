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

const compute_date_range_DaysFormatted = (date_range_option) => {
    return 'test';
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
    }
});


createApp({
    state,
    mounted() {
        state.hideDateSelector();
    }
}).mount();
