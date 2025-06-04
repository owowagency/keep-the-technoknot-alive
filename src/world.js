import { Ticker } from "./ticker.js";
import { createCanvas, registerFont } from "canvas";
import fs from "node:fs";
import path from "node:path";
import { FPS, LAYOUT, DEVICES, OPTIONS } from "./settings.js";
import { createDisplay } from "flipdisc";
import "./preview.js";
import { eventEmitter } from "./events.js";
import { starvation, STARVATION_TIME, setStarvation, lifeStatus, LIFE_STATUS_ENUM, deathTime, setDeathTime, hatchTime, setHatchTime, TOTAL_DEATH_TIME, TOTAL_UNBORN_TIME } from "./state.js";
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

	console.log({ lifeStatus, hunger: `${Math.round(starvation / STARVATION_TIME * 100)}%`, 'death time': `${Math.round(deathTime / TOTAL_DEATH_TIME * 100)}%`, 'hatch time': `${Math.round(hatchTime / TOTAL_UNBORN_TIME * 100)}%` })

	switch (lifeStatus) {
		case LIFE_STATUS_ENUM.IDLE:
			setStarvation(starvation + deltaTime / 1000)
			if (starvation > STARVATION_TIME)
				eventEmitter.emit('dead')
			break

		case LIFE_STATUS_ENUM.DEAD:
			setDeathTime(deathTime + deltaTime / 1000)
			if (deathTime > TOTAL_DEATH_TIME)
				eventEmitter.emit('revive')
			break

		case LIFE_STATUS_ENUM.UNBORN:
			setHatchTime(hatchTime + deltaTime / 1000)
			if (hatchTime > TOTAL_UNBORN_TIME)
				eventEmitter.emit('hatch')
			break
	}

	renderImage('frames/idle.png', ctx, width, height);
	console.log(animator.currentFrame());

	renderImage(animator.currentFrame(), ctx, width, height);

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
