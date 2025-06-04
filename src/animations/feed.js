import { feedingAnimation } from '../state';

export const sleep = {
    keyframes: {
        0: 'feed1.png',
        1000: 'feed2.png',
    },
    onEnd: () => feedingAnimation = false,
};

