//@ts-check


import Parser from './regexper-static/src/js/parser/javascript.js';

export const activate = () => {

	/**
	 * 
	 * @param {import('vscode-notebook-renderer').OutputItem} item 
	 * @param {HTMLElement} element 
	 */
	async function renderOutputItem(item, element) {

		element.innerHTML = `
		<div class="messages" style="visibility: hidden;"></div>
		<div class="progress">
			<div>
			</div>
		</div>
		<div class="svg" style="overflow-x: scroll;">
			<svg>
			</svg>
		</div>`;

		try {
			const parser = new Parser(element, { keepContent: true });
			await parser.parse(item.text());

			// unset flags, rendered in status bar
			parser.parsed.flags = [];

			await parser.render();

		} catch (err) {
			console.error(err);
			element.innerText = String(err);
		}
	}

	return { renderOutputItem };
};

// append base element
// <script type="text/html" id="svg-container-base"></script>
const containerBase = document.createElement('script');
document.head.appendChild(containerBase);
containerBase.type = 'text/html';
containerBase.id = 'svg-container-base';

const style = document.createElement('style');
document.head.appendChild(style);
style.innerText = `
svg {
	fill: var(--theme-foreground);
}
.root text,
.root tspan {
	font: 12px Arial;
}
/* Line between the matches */
.root path {
	fill-opacity: 0;
	stroke-width: 2px;
	stroke: var(--theme-foreground);
}
/* Start and end circles */
.root circle {
	fill: var(--theme-background);
	stroke-width: 2px;
	stroke: var(--theme-foreground);
}
/* Foreground for any matches */
.anchor text,
.any-character text {
	fill: var(--theme-foreground);
}
/* Background for any matches */
.anchor rect,
.any-character rect {
	fill: var(--theme-background);
	stroke-width: 1px;
	stroke: var(--vscode-focusBorder);
}
/* Foreground for escape char */
.escape text,
.charset-escape text {
	fill: var(--vscode-menu-foreground);
}
/* Background for escape char */
.escape rect,
.charset-escape rect {
	fill: var(--vscode-menu-background);
	stroke-width: 1px;
	stroke: var(--vscode-menu-border);
}
/* Forground for literal */
.literal text {
	fill: var(--vscode-menu-selectionForeground);
}
/* Background for literal */
.literal rect {
	fill: var(--vscode-menu-selectionBackground);
	stroke-width: 1px;
	stroke: var(--vscode-menu-selectionBorder);
}
/* Background for char class */
.charset .charset-box {
	fill: var(--theme-menu-background);
	stroke-width: 1px;
	stroke: var(--vscode-focusBorder);
}
/* Label text for char class */
.charset .charset-label {
	fill: var(--theme-foreground);
}
/* Label text for char class or group */
.subexp .subexp-label tspan,
.charset .charset-label tspan,
.match-fragment .repeat-label tspan {
	font-size: 10px;
}
.repeat-label {
	cursor: help;
}
.subexp .subexp-label tspan,
.charset .charset-label tspan {
	dominant-baseline: text-after-edge;
}
.subexp .subexp-box {
	stroke: var(--theme-foreground);
	stroke-dasharray: 6, 2;
	stroke-width: 2px;
	fill-opacity: 0;
}
.quote {
	fill: rgba(var(--theme-foreground), 0.5);
}
`;
