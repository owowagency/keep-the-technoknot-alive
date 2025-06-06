import { lifeStatus } from '../state.js';
import {feeding} from './feeding.js';
import {idle} from './idle.js';
import {sleeping} from './sleeping.js';
import {dead} from './dead.js';
import {unborn} from './unborn.js';

export const animations = {
    feeding,
    idle,
    sleeping,
    dead,
    unborn,
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

        const gabba = elapsedTime % animation.duration;

        let currentKeyframe = keyFramesMilliseconds[0];
        let minDiff = Math.abs(gabba - currentKeyframe);

        for (let i = 1; i < keyFramesMilliseconds.length; i++) {
          const diff = Math.abs(gabba - keyFramesMilliseconds[i]);
          if (diff < minDiff) {
            minDiff = diff;

            currentKeyframe = keyFramesMilliseconds[i];
          }
        }

        return animation.keyframes[currentKeyframe];
    }
};
