import dayjs from "dayjs"

export const toDateAndMonth = (date: string) => {
    return dayjs(date).format("DD MMM")
}