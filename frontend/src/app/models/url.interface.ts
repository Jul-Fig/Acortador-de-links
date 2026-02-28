export interface Url {
    id?:string
    url:string
    shortCode:string
    accessCount:number
    createdAt:Date | string
    updatedAt: Date | string
}

export interface ApiError{
    error:string
    message?: string
}