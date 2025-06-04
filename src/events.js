import EventEmitter from "node:events";
import { starvation, LIFE_STATUS_ENUM, FOOD_EFFECTIVENESS, setStarvation, setLifeStatus, setDeathTime, setHatchTime } from "./state.js";
import { renderImage } from "./render.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on('feed', () => {
    setStarvation(starvation - Math.min(starvation, FOOD_EFFECTIVENESS))
})

eventEmitter.on('dead', () => {
    setLifeStatus(LIFE_STATUS_ENUM.DEAD);
    setStarvation(0)
    renderImage('frames/dead.png')
});

eventEmitter.on('revive', () => {
    setLifeStatus(LIFE_STATUS_ENUM.UNBORN);
    setDeathTime(0)
    renderImage('frames/unborn.png')
})

eventEmitter.on('hatch', () => {
    setLifeStatus(LIFE_STATUS_ENUM.IDLE);
    setHatchTime(0)
    renderImage('frames/idle.png')
});

export default eventEmitter
