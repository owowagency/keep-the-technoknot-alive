export const STARVATION_TIME = 5 // The time it takes for the fucker to starve, in seconds
export const FOOD_EFFECTIVENESS = 15 // The amound of seconds every food given will reduce from the starvation

export const LIFE_STATUS_ENUM = {
    UNBORN: 'unborn',
    IDLE: 'idle',
    FEEDING: 'feeding',
    DEAD: 'dead',
}
export const TOTAL_DEATH_TIME = 5 // The time the fucker takes to be unborn again, in seconds
export const TOTAL_UNBORN_TIME = 5 // The time the fucker takes to be born again, in seconds

export let starvation = 0
export const setStarvation = (input) => starvation = input

export let lifeStatus = LIFE_STATUS_ENUM.IDLE
export const setLifeStatus = (input) => lifeStatus = input

export let deathTime = 0
export const setDeathTime = (input) => deathTime = input

export let hatchTime = 0
export const setHatchTime = (input) => hatchTime = input

export let sleepingAnimation = false;

export let feedingAnimation = false;