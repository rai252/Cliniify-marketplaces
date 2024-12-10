import { APIService } from "../services/api.service"
import { IBlog, IBlogs } from "../types/blog/blog"

class BlogService extends APIService {
    async getBlogs(params: any = {}): Promise<IBlogs> {
        return this.get('/api/blogs/', { params })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async getBlogDetail(params: any = {}): Promise<IBlog> {
        const { id } = params;
        return this.get(`/api/blogs/${id}/`, { params })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }
}

export const blogService = new BlogService()