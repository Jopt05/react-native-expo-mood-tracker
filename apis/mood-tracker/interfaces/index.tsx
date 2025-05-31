export interface RegisterProps { name?: string, email: string, password: string };

export interface LoginProps { email: string, password: string }

export interface LoginResponse {
  message:    string;
  statusCode: number;
  payload:    LoginPayload;
}

export interface LoginPayload {
  token: string;
}

export interface GetUserResponse {
  message:    string;
  statusCode: number;
  payload:    UserPayload;
}

export interface UserPayload {
  id:        number;
  email:     string;
  name:      string;
  password:  string;
  createdAt: Date;
  updatedAt: Date;
}