import { Farm, Advisory, WeatherData, YieldAnalysis } from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getFarms(userId = 'farmer-demo-user'): Promise<Farm[]> {
    const res = await fetch(`${API_BASE}/farms`, {
      headers: {
        'x-user-id': userId
      }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch farms');
    return json.data || [];
  },

  async getFarmById(id: string, userId = 'farmer-demo-user'): Promise<Farm & { advisories: Advisory[] }> {
    const res = await fetch(`${API_BASE}/farms/${id}`, {
      headers: {
        'x-user-id': userId
      }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch farm');
    return json.data;
  },

  async createFarm(data: Partial<Farm>, userId = 'farmer-demo-user'): Promise<Farm> {
    const res = await fetch(`${API_BASE}/farms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) {
      const msg = json.details ? json.details.map((d: any) => d.message).join(', ') : json.error;
      throw new Error(msg || 'Failed to create farm');
    }
    return json.data;
  },

  async getAdvisories(params: {
    userId?: string;
    farmId?: string;
    search?: string;
    severity?: string;
    issueCategory?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: Advisory[]; total: number; page: number; totalPages: number }> {
    const url = new URL(`${window.location.origin}${API_BASE}/advisories`);
    if (params.farmId) url.searchParams.set('farmId', params.farmId);
    if (params.search) url.searchParams.set('search', params.search);
    if (params.severity) url.searchParams.set('severity', params.severity);
    if (params.issueCategory) url.searchParams.set('issueCategory', params.issueCategory);
    if (params.page) url.searchParams.set('page', String(params.page));
    if (params.limit) url.searchParams.set('limit', String(params.limit));

    const res = await fetch(url.toString(), {
      headers: {
        'x-user-id': params.userId || 'farmer-demo-user'
      }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch advisories');
    return json;
  },

  async getAdvisoryById(id: string, userId = 'farmer-demo-user'): Promise<Advisory> {
    const res = await fetch(`${API_BASE}/advisories/${id}`, {
      headers: {
        'x-user-id': userId
      }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch advisory report');
    return json.data;
  },

  async createAdvisory(formData: FormData, userId = 'farmer-demo-user'): Promise<Advisory> {
    const res = await fetch(`${API_BASE}/advisories`, {
      method: 'POST',
      headers: {
        'x-user-id': userId
      },
      body: formData
    });
    const json = await res.json();
    if (!res.ok) {
      const msg = json.details ? json.details.map((d: any) => d.message).join(', ') : json.error;
      throw new Error(msg || 'Failed to generate advisory');
    }
    return json.data;
  },

  async getWeather(region?: string): Promise<WeatherData> {
    const url = new URL(`${window.location.origin}${API_BASE}/weather`);
    if (region) url.searchParams.set('region', region);
    const res = await fetch(url.toString());
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch weather data');
    return json.data;
  },

  async getYieldForecast(params: {
    crop?: string;
    soil?: string;
    ph?: number;
    irrigation?: string;
    severity?: string;
  } = {}): Promise<YieldAnalysis> {
    const url = new URL(`${window.location.origin}${API_BASE}/analytics/yield`);
    if (params.crop) url.searchParams.set('crop', params.crop);
    if (params.soil) url.searchParams.set('soil', params.soil);
    if (params.ph) url.searchParams.set('ph', String(params.ph));
    if (params.irrigation) url.searchParams.set('irrigation', params.irrigation);
    if (params.severity) url.searchParams.set('severity', params.severity);

    const res = await fetch(url.toString());
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch yield forecast');
    return json.data;
  }
};
