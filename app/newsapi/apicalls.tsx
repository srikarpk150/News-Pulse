import axios from 'axios';

class NewsService {
    private apiClient:any;
    

    constructor() {
        this.apiClient = axios.create({
            baseURL: 'https://newsapi.org/v2/',
        });
    }

    async getNewsFromAPI() {
        try {
            const apiKey: string = process.env.EXPO_PUBLIC_API_Key!;
            const url = 'everything?q=international&apiKey='+apiKey;
            const response = await this.apiClient.get(url);
            return response.data;
        } catch (error) {
            console.log('NewsService :: getNewsFromAPI() :: ' + error);
        }
    }
}

export default NewsService;
