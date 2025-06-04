export const STARVATION_TIME = 60 // The time it takes for the hunger to go from 0 to 100, in seconds
export const FOOD_EFFECTIVENESS = 10 // The amound of seconds every food given will reduce from the starvation

export const LIFE_STATUS_ENUM = {
    UNBORN: 'unborn',
    ALIVE: 'alive',
    DEAD: 'dead',
}

export let starvation = 0
export const setStarvation = (input) => starvation += input

export let foodAmount = 0
export const incFoodAmount = (input) => foodAmount += input

export let lifeStatus = LIFE_STATUS_ENUM.ALIVE
export const setLifeStatus = (input) => lifeStatus = input