import { createCanvas, registerFont, loadImage } from "canvas";
import fs from "node:fs";
import { FPS, LAYOUT } from "./settings.js";
import { Display } from "@owowagency/flipdot-emu";
import { Animator } from "./animations/index.js";
import path from "node:path";

const IS_DEV = process.argv.includes("--dev");

// Create display
const display = new Display({
	layout: LAYOUT,
	panelWidth: 28,
	isMirrored: true,
	transport: !IS_DEV ? {
		type: 'serial',
		path: '/dev/ttyACM0',
		baudRate: 57600
	} : {
		type: 'ip',
		host: '127.0.0.1',
		port: 3000
	}
});
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

const animator = new Animator();

export const renderImage = async (elapsedTime) => {
    const image = await loadImage(animator.currentFrame(elapsedTime));
    ctx.drawImage(image, 0, 0, width, height);

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
        const imageData = ctx.getImageData(0, 0, display.width, display.height);
		display.setImageData(imageData);
		if (display.isDirty()) {
			display.flush();
		}
    }
}
