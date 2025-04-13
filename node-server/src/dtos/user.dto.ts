export interface CreateUserDTO {
  id: string;
  password: string;
  nickname: string;
}

export interface CreateOauthUserDTO {
  provider: string;
  provider_user_id: string;
  nickname: string;
  email?: string;
  access_token: string;
  refresh_token: string;
}

export interface UpdateOauthUserDTO {
  provider_user_id: string;
  access_token?: string;
  refresh_token?: string;
}

// JWT Payload 타입 정의
export interface JwtUserDTO {
  id: string; // 사용자 ID
  provider?: string;
}
