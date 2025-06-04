import eventEmitter from "../events.js";

export const feed = () => {
    eventEmitter.emit('feed');
};
