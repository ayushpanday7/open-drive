export type userType = {
    _id: string
    name: string
    email: string
    password: string
    role: string,
    profile: string
    permissions: string[],
    createdAt: Date
    updatedAt: Date
}