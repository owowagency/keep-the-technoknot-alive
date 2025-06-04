import EventEmitter from "node:events";
import { starvation, LIFE_STATUS_ENUM, FOOD_EFFECTIVENESS, incFoodAmount, setLifeStatus } from "./state.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on('feed', () => {
    console.log('eventEmitter:feed');
    incFoodAmount(Math.min(starvation, FOOD_EFFECTIVENESS));
})
eventEmitter.on('dead', () => {
    console.log('eventEmitter:dead')
    setLifeStatus(LIFE_STATUS_ENUM.DEAD);
});

export default eventEmitter
