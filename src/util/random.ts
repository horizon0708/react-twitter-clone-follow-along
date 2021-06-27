
export const getRandomInt = (floor: number, ceiling: number) => {
    const min = Math.ceil(floor);
    const max = Math.floor(ceiling);
    return Math.floor(Math.random() * (max - min) + min)
}