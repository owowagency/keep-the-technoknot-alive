import { lifeStatus } from '../state.js';
import {feeding} from './feeding.js';
import {idle} from './idle.js';
import {sleeping} from './sleeping.js';

export const animations = {
    feeding,
    idle,
    sleeping,
};

export let currentAnimationKey = undefined;

export let animationStart = undefined;

export class Animator {
    currentFrame(elapsedTime) {
        if (currentAnimationKey !== lifeStatus) {
            currentAnimationKey = lifeStatus;

            animationStart = elapsedTime;
        }

        const animation = animations[currentAnimationKey];

        const keyFramesMilliseconds = Object.keys(animation.keyframes);

        let currentKeyframe = keyFramesMilliseconds.reduce((acc, current) => {
            const mod = elapsedTime % animation.duration;

            if ((mod - current) < acc) { 
                return current;
            }

            return acc;
        }, Infinity)

        return animation.keyframes[currentKeyframe];
    }
};
