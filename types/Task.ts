export type Task = {
    _id: string | undefined,
    userId: string,
    name: string,
    finishPrevisionDate: Date,
    finishDate?: Date
}