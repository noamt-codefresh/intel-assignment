

export interface LoginResponse {
  iat: string;
  exp: number;
  token: string;
  userProfile: UserProfile;
}

export interface UserProfile {
  name: string;
}

export interface RegisterResponse {
  name: string;
}
