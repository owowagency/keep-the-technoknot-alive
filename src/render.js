import { createCanvas, registerFont, loadImage } from "canvas";
import { createDisplay } from "flipdisc";
import fs from "node:fs";
import { FPS, LAYOUT, DEVICES, OPTIONS } from "./settings.js";

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

export const renderImage = async (path) => {
    const image = await loadImage(path);
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
}