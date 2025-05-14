export default function ArrowTemplate(number_of_videos) {
    switch (number_of_videos) {
        case 0:
            return `
                <span class="video_marker empty">
                    <span class="figure">
                        <svg width="0" height="0" viewBox="0 0 0 0">
                            <g class="aplos-box-triangle-right-shape-group point style-scope yta-line-chart-base">
                                <g class="aplos-box-triangle-right-shape style-scope yta-line-chart-base" fill="var(--ytcp-text-secondary)" width="16px" height="16px">
                                    <rect class="primary style-scope yta-line-chart-base" rx="2" ry="2" width="16" height="16" fill="var(--ytcp-text-secondary)" stroke-width="0"></rect>
                                    <path class="secondary style-scope yta-line-chart-base" d="M5.5 3.5v9l6-4.5z" fill="white" transform="scale(1)"></path>
                                </g>
                            </g>
                        </svg>
                    </span>
                </span>`;
        case 1:
            return `
                <span class="video_marker single">
                    <span class="figure">
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <g>
                                <g width="16px" height="16px">
                                    <rect rx="2" ry="2" width="16" height="16" stroke-width="0"></rect>
                                    <path d="M5.5 3.5v9l6-4.5z" fill="currentColor"></path>
                                </g>
                            </g>
                        </svg>
                    </span>
                </span>`;
        default:
            return `
                <span class="video_marker">
                    <span class="figure">
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <g>
                                <text text-anchor="middle" opacity="1" dx="8" dy="9" dominant-baseline="middle" style="fill: white; font-size: 10px;">${number_of_videos}</text>
                            </g>
                        </svg>
                    </span>
                </span>`;
    }
}

