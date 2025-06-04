import EventEmitter from "node:events";
import { starvation, LIFE_STATUS_ENUM, FOOD_EFFECTIVENESS, setStarvation, setLifeStatus, setDeathTime, setHatchTime } from "./state.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on('feed', () => {
    setStarvation(starvation - Math.min(starvation, FOOD_EFFECTIVENESS))
})

eventEmitter.on('dead', () => {
    setLifeStatus(LIFE_STATUS_ENUM.DEAD);
    setStarvation(0)
});

eventEmitter.on('revive', () => {
    setLifeStatus(LIFE_STATUS_ENUM.UNBORN);
    setDeathTime(0)
})

eventEmitter.on('hatch', () => {
    setLifeStatus(LIFE_STATUS_ENUM.ALIVE);
    setHatchTime(0)
});

export default eventEmitter
