import axios from 'axios';


const categoryMapping: { [key: string]: string } = {
    "Corporate/Industry Events": "Conference",
    "Ideas Festivals": "Ideas",
    "Political Events": "Politics",
    "Social Events": "Social",
    "Lifestyle Expos": "Expo",
    "Cultural Events": "Festival",
    "Galas and Awards": "Awards",
    "Education and Training Workshops": "Workshop",
    "Listening and Community Events": "Community"
  };

  const trendingMapping: string[] = [
    'Sports',
    'Entertainment',
    'Technology',
    'Health',
    'Politics',
  ];


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

    async getCategoryNewsFromAPI(selectedCategories: Array<string>) {
        try {
            const apiKey: string = process.env.EXPO_PUBLIC_API_Key!;
    
            const results: Record<string, any[]> = {};

        for (const category of selectedCategories) {
            const mappedCategory = categoryMapping[category] || category;
            const url = `everything?q=${mappedCategory}&apiKey=${apiKey}`;
            
            const response = await this.apiClient.get(url);
            results[category] = response.data.articles.filter((article: any) => article.urlToImage).slice(0, 10);
        }
        return results;
        } catch (error) {
            console.error('NewsService :: getCategoryNewsFromAPI() :: ', error);
        }
    }

    async getTrendingNewsFromAPI() {
        try {
            const apiKey: string = process.env.EXPO_PUBLIC_API_Key!;
            const results: Record<string, any[]> = {};
            for (const category of trendingMapping) {
                const url = `https://newsapi.org/v2/top-headlines?q=${category}&pageSize=10&apiKey=${apiKey}`;
                try {
                    const response = await this.apiClient.get(url);
                    results[category] = response.data.articles
                        .filter((article: any) => article.urlToImage) 
                        .slice(0, 10);
                } catch (error) {
                    console.error(`Failed to fetch news for category: ${category}`, error);
                }
            }
            return results;
        } catch (error) {
            console.error('NewsService :: getTrendingNewsFromAPI() :: ', error);
            return {};
        }
    }
} 
export default NewsService;
