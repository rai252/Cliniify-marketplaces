import { IFeedback, IUpdateFeedback, IFeedbackPost, IFeedbackList, IDoctorReplyPost, IDoctorReplyUpdate } from '@/types/feedback/feedback'
import { APIService } from '../services/api.service'

class FeedbackService extends APIService {

    async postFeedback(feedbackData: IFeedbackPost): Promise<number> {
        try {
            const response = await this.post('/api/feedbacks/', feedbackData);
            return response?.data?.id || 0;
        } catch (error: any) {
            throw (error.response?.data as any) || error.message || 'Unknown error';
        }
    }

    async getFeedbacks(params: any = {}): Promise<IFeedbackList> {
        return this.get('/api/feedbacks/', { params })
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async getFeedbackDetail(id: number): Promise<IFeedback> {
        return this.get(`/api/feedbacks/${id}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async updateFeedback(id: number, feedbackData: IUpdateFeedback): Promise<IUpdateFeedback> {
        try {
            const response = await this.put(`/api/feedbacks/${id}/`, feedbackData);
            return response?.data?.id || 0;
        } catch (error: any) {
            throw (error.response?.data as any) || error.message || 'Unknown error';
        }
    }

    async deleteFeedback(id: number): Promise<any> {
        return this.delete(`/api/feedbacks/${id}/`)
            .then((response) => response?.data)
            .catch((error) => {
                throw error?.response?.data;
            });
    }

    async doctorReplyPost(feedbackData: IFeedback): Promise<IDoctorReplyPost> {
        try {
            const response = await this.post('/api/feedbacks/', feedbackData);
            return response?.data?.id || 0;
        } catch (error: any) {
            throw (error.response?.data as any) || error.message || 'Unknown error';
        }
    }

    async doctorReply(id: number, feedbacksData: IDoctorReplyUpdate): Promise<IDoctorReplyUpdate> {
        try {
            const response = await this.patch(`/api/feedbacks/${id}/`, feedbacksData);
            return response?.data?.id || 0;
        } catch (error: any) {
            throw (error.response?.data as any) || error.message || 'Unknown error';
        }
    }
}

export const feedbackService = new FeedbackService();