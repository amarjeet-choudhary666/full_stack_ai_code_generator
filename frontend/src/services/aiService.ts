import api from './api';

export interface GenerateCodeData {
  prompt: string;
  language?: string;
}

export interface GenerateCodeResponse {
  success: boolean;
  data: {
    generatedCode: string;
    language: string;
    historyId: string;
    codeLength: number;
    linesOfCode: number;
  };
  message: string;
}

export interface ImproveCodeData {
  code: string;
  language?: string;
  improvementType?: 'general' | 'performance' | 'security' | 'readability' | 'testing';
}

export interface ImproveCodeResponse {
  success: boolean;
  data: {
    originalCode: string;
    improvedCode: string;
    language: string;
    improvementType: string;
    codeLength: number;
    linesOfCode: number;
  };
  message: string;
}

export interface ExplainCodeData {
  code: string;
  language?: string;
}

export interface ExplainCodeResponse {
  success: boolean;
  data: {
    code: string;
    language: string;
    explanation: string;
    codeLength: number;
    linesOfCode: number;
  };
  message: string;
}

export interface PromptHistoryItem {
  _id: string;
  prompt: string;
  generatedCode: string;
  programmingLanguage: string;
  createdAt: string;
}

export interface PromptHistoryResponse {
  success: boolean;
  data: {
    history: PromptHistoryItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message: string;
}

export interface PromptDetailResponse {
  success: boolean;
  data: PromptHistoryItem;
  message: string;
}

export const aiService = {
  async generateCode(data: GenerateCodeData): Promise<GenerateCodeResponse> {
    const response = await api.post('/ai/generate', data);
    return response.data;
  },

  async improveCode(data: ImproveCodeData): Promise<ImproveCodeResponse> {
    const response = await api.post('/ai/improve', data);
    return response.data;
  },

  async explainCode(data: ExplainCodeData): Promise<ExplainCodeResponse> {
    const response = await api.post('/ai/explain', data);
    return response.data;
  },

  async getPromptHistory(page: number = 1, limit: number = 10): Promise<PromptHistoryResponse> {
    const response = await api.get(`/ai/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getPromptById(id: string): Promise<PromptDetailResponse> {
    const response = await api.get(`/ai/history/${id}`);
    return response.data;
  },

  async deletePrompt(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/ai/history/${id}`);
    return response.data;
  },

  async regenerateCode(id: string, language?: string): Promise<GenerateCodeResponse> {
    const response = await api.put(`/ai/regenerate/${id}`, { language });
    return response.data;
  },
};