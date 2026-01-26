import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface AgentPersona {
  tone: string;
  style: string;
  focus: string;
}

export interface AgentConfig {
  type: string;
  persona: AgentPersona;
  rules: string[];
}

export interface ChatRequest {
  message: string;
  agent: AgentConfig;
}

@Injectable()
export class AiChatService {
  private readonly aiApiUrl: string;

  constructor(private configService: ConfigService) {
    this.aiApiUrl = this.configService.get<string>('AI_API_URL') || 'https://api-ia-rt8v.onrender.com';
  }

  async sendMessage(request: ChatRequest): Promise<any> {
    try {
      const response = await axios.post(`${this.aiApiUrl}/chat`, request, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos de timeout
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Tratamento específico para erro 429 (limite de créditos)
        if (error.response.status === 429) {
          const detail = error.response.data?.detail;
          if (detail && detail.includes('Limite de créditos')) {
            throw new HttpException(
              'Os créditos da API acabaram. Tente novamente mais tarde.',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }
        }
        
        throw new HttpException(
          `AI API error: ${error.response.data?.message || error.response.data?.detail || 'Unknown error'}`,
          error.response.status,
        );
      } else if (error.request) {
        throw new HttpException(
          'AI API não respondeu. Tente novamente mais tarde.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        throw new HttpException(
          'Erro ao se comunicar com a AI API',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
