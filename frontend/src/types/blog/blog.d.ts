export interface IBlog {
    id: number
    title: string
    slug: string
    subtitle: string
    image: string | File | null
    content: string
    created_at: string
}

export interface IBlogs {
    count: number
    next: string | null
    previous: string | null
    results: {
        id: number
        title: string
        slug: string
        subtitle: string
        image: string | File | null
        content: string
        created_at: string
    }[]
}