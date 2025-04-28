export default function TrendIcon(props) {
    return {
        trend: props.trend,
        $template: `
<div
    v-if="trend != null"
    id="icon-container"
    class="style-scope yta-key-metric-block"
    aria-labelledby="goog_524457768"
    role="tooltip"
>
    <tp-yt-iron-icon
        compact=""
        class="performance-icon style-scope yta-key-metric-block style-scope yta-key-metric-block"
        v-effect="trend === 'up' ? $el.classList.add('green') : null;"
    >
        <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%" class="style-scope tp-yt-iron-icon" aria-hidden="true">
            <g version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" style="enable-background: new 0 0 24 24" xml:space="preserve" class="style-scope tp-yt-iron-icon">
                <path v-if="trend === 'down'" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,18.41l-4.71-4.71l1.41-1.41L11,14.59V6h2v8.59l2.29-2.29l1.41,1.41L12,18.41z" class="style-scope tp-yt-iron-icon"></path>
                <path v-else-if="trend === 'up'" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M15.29,11.71L13,9.41V18h-2V9.41l-2.29,2.29l-1.41-1.41L12,5.59l4.71,4.71L15.29,11.71z" class="style-scope tp-yt-iron-icon"></path>
            </g>
        </svg>
    </tp-yt-iron-icon>
</div>
        `,
    }
} 