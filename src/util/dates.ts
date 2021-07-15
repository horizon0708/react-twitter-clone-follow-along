import dayjs from "dayjs"
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export const toDateAndMonth = (date: string) => {
    return dayjs(date).format("DD MMM HH:MM")
}

export const toRelativeTime = (date:string) => {
    return (dayjs(date) as any).fromNow()
}