import { lifeStatus } from '../state.js';
import {feeding} from './feeding.js';
import {idle} from './idle.js';
import {sleeping} from './sleeping.js';

export const animations = {
    feeding,
    idle,
    sleeping,
};

export const currentAnimationKey = undefined;

export const currentAnimation = undefined;

export class Animator {
    currentFrame() {
        const animation = animations[lifeStatus] || animations.idle;


        return animation.keyframes[0];
    }
};
