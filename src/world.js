import { Ticker } from "./ticker.js";
import { createCanvas, registerFont } from "canvas";
import fs from "node:fs";
import path from "node:path";
import { FPS } from "./settings.js";
import "./preview.js";
import { eventEmitter } from "./events.js";
import { starvation, STARVATION_TIME, setStarvation, lifeStatus, LIFE_STATUS_ENUM, deathTime, setDeathTime, hatchTime, setHatchTime, TOTAL_DEATH_TIME, TOTAL_UNBORN_TIME } from "./state.js";
import { Animator } from "./animations/index.js";
import { renderImage } from "./render.js";

// Initialize the ticker at x frames per second
const ticker = new Ticker({ fps: FPS });

const animator = new Animator();

let prevElepsedTime = 0
ticker.start(({ elapsedTime }) => {
	const deltaTime = elapsedTime - prevElepsedTime
	prevElepsedTime = elapsedTime

	console.clear();

	console.log({ lifeStatus, hunger: `${Math.round(starvation / STARVATION_TIME * 100)}%`, 'death time': `${Math.round(deathTime / TOTAL_DEATH_TIME * 100)}%`, 'hatch time': `${Math.round(hatchTime / TOTAL_UNBORN_TIME * 100)}%` })
	
	renderImage(elapsedTime);

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


});
