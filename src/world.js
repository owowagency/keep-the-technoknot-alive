import { Ticker } from "./ticker.js";
import { createCanvas, registerFont } from "canvas";
import fs from "node:fs";
import path from "node:path";
import { FPS, LAYOUT, DEVICES, OPTIONS } from "./settings.js";
import { createDisplay } from "flipdisc";
import "./preview.js";
import { eventEmitter } from "./events.js";
import { starvation, foodAmount, STARVATION_TIME, setStarvation, lifeStatus } from "./state.js";
import { renderImage } from "./render.js";

const IS_DEV = process.argv.includes("--dev");

// Create display
const display = createDisplay(LAYOUT, DEVICES, OPTIONS);
const { width, height } = display;

// Create output directory if it doesn't exist
const outputDir = "./output";
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

// Create canvas with the specified resolution
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Disable anti-aliasing and image smoothing
ctx.imageSmoothingEnabled = false;

// Initialize the ticker at x frames per second
const ticker = new Ticker({ fps: FPS });

ticker.start(({ elapsedTime }) => {
	console.clear();

	setStarvation(elapsedTime / 1000 - foodAmount)
	console.log({ starvation, foodAmount, lifeStatus })

	if (starvation > STARVATION_TIME)
		eventEmitter.emit('dead')

	renderImage(ctx, width, height);

	if (IS_DEV) {
		// Save the canvas as a PNG file
		const filename = path.join(outputDir, "frame.png");
		const buffer = canvas.toBuffer("image/png");
		fs.writeFileSync(filename, buffer);
	} else {
		const { data } = ctx.getImageData(0, 0, display.width, display.height);
		display.send([...data.values()]);
	}
});
