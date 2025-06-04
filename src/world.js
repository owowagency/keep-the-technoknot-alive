import { Ticker } from "./ticker.js";
import { createCanvas, registerFont } from "canvas";
import fs from "node:fs";
import path from "node:path";
import { FPS, LAYOUT, DEVICES, OPTIONS } from "./settings.js";
import { createDisplay } from "flipdisc";
import "./preview.js";
import { eventEmitter } from "./events.js";
import { starvation, STARVATION_TIME, incStarvation, lifeStatus } from "./state.js";
import { renderImage } from "./render.js";
import { Animator } from "./animations/index.js";

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

const animator = new Animator();

let prevElepsedTime = 0
ticker.start(({ elapsedTime }) => {
	const deltaTime = elapsedTime - prevElepsedTime
	prevElepsedTime = elapsedTime

	console.clear();

	incStarvation(deltaTime / 1000)
	console.log({ starvation, lifeStatus })

	if (starvation > STARVATION_TIME)
		eventEmitter.emit('dead')

	// if (lifeStatus === LIFE_STATUS_ENUM.DEAD) {
	// 	setDeathTime(elapsedTime / 1000)
	// }

	renderImage(animator.currentFrame(elapsedTime), ctx, width, height);

	{
		const imageData = ctx.getImageData(0, 0, width, height);
		const data = imageData.data;
		for (let i = 0; i < data.length; i += 4) {
			// Apply thresholding - any pixel above 127 brightness becomes white (255), otherwise black (0)
			const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
			const binary = brightness > 127 ? 255 : 0;
			data[i] = binary; // R
			data[i + 1] = binary; // G
			data[i + 2] = binary; // B
			data[i + 3] = 255; // The board is not transparent :-)
		}
		ctx.putImageData(imageData, 0, 0);
	}

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
