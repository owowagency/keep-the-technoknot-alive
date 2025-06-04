export const STARVATION_TIME = 60 // The time it takes for the fucker to starve, in seconds
export const FOOD_EFFECTIVENESS = 10 // The amound of seconds every food given will reduce from the starvation

export const LIFE_STATUS_ENUM = {
    UNBORN: 'unborn',
    IDLE: 'idle',
    FEEDING: 'feeding',
    DEAD: 'dead',
    SLEEPING: 'sleeping',
}
export const TOTAL_DEATH_TIME = 10 // The time the fucker takes to be unborn again, in seconds
export const TOTAL_UNBORN_TIME = 10 // The time the fucker takes to be born again, in seconds

export let starvation = 0
export const incStarvation = (input) => starvation += input

export let lifeStatus = LIFE_STATUS_ENUM.SLEEPING
export const setLifeStatus = (input) => lifeStatus = input

export let deathTime = 0
export const setDeathTime = (input) => deathTime = input

export let bornTime = 0
export const setBornTime = (input) => bornTime = input
