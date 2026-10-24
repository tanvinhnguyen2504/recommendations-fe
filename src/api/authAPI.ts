import { ApiEnvelope } from '@/types/api';
import { MeResponse } from '@/types/auth';
import { BaseCursorAPI } from './baseCursorAPI';
import { AUTH_API_BASE, ENDPOINTS } from './endpoints';

class BaseAuthAPI extends BaseCursorAPI {
  constructor() {
    // The auth service, not the recommendations service the shared instance defaults to.
    super(AUTH_API_BASE);
  }

  getGoogleSignInURL(): string {
    return `${AUTH_API_BASE}${ENDPOINTS.AUTH_GOOGLE_LOGIN}`;
  }
  async fetchMe(): Promise<MeResponse> {
    const { data } = await this.get<ApiEnvelope<MeResponse>>(ENDPOINTS.ME);
    return data;
  }
  async logout(): Promise<void> {
    return this.post<void>(ENDPOINTS.AUTH_LOGOUT);
  }
}

export const AuthAPI = new BaseAuthAPI();
