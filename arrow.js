export default function ArrowTemplate(number_of_videos) {
    switch (number_of_videos) {
        case 's': 
            return `
                <span class="video_marker empty">
                    <span class="figure">
                        <svg width="0" height="0" viewBox="0 0 0 0">
                           <g class="aplos-yt-short-shape-group point style-scope yta-line-chart-base">
                                <g class="aplos-yt-short-shape style-scope yta-line-chart-base" fill="white" width="16px" height="16,px" transform="translate(774, 7)">
                                    <path class="primary style-scope yta-line-chart-base" d="M15.2365 7.53886C16.9148 6.57982 17.4979 4.44183 16.5388 2.76352C15.5798 1.08521 13.4418 0.502118 11.7635 1.46115L4.7635 5.46115C3.61069 6.1199 2.92989 7.37425 3.0057 8.69984C3.08151 10.0254 3.90087 11.194 5.12127 11.717L5.66097 11.9483L4.7635 12.4612C3.08519 13.4202 2.5021 15.5582 3.46114 17.2365C4.42017 18.9148 6.55816 19.4979 8.23647 18.5389L15.2365 14.5389C16.3893 13.8801 17.0701 12.6258 16.9943 11.3002C16.9185 9.97458 16.0991 8.80603 14.8787 8.283L14.339 8.0517L15.2365 7.53886ZM8.5 7.5L8.5 12.5L13 10L8.5 7.5Z" fill="var(--ytcp-text-secondary)" fill-rule="evenodd" transform="scale(0.8888)"></path>
                                    <circle class="secondary style-scope yta-line-chart-base"></circle>
                                </g>
                           </g>
                        </svg>
                    </span>
                </span>
            `;
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

