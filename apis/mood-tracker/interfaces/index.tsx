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
  photoUrl?: string;
}
export interface GetMoodsResponse {
  message:    string;
  statusCode: number;
  payload:    Payload;
}

export interface Payload {
  page:     number;
  limit:    number;
  total:    number;
  next:     string;
  previous: null;
  mood:     Mood[];
}

export interface Mood {
  id:         number;
  mood:       string;
  sleep:      string;
  createdAt:  Date;
  updatedAt:  Date;
  authorId:   number;
  reflection: null | string;
}
export interface CreateMoodResponse {
  message:    string;
  statusCode: number;
  payload:    Mood;
}
export interface AdviceResponse {
  message:    string;
  statusCode: number;
  payload:    AdviceData;
}

export interface AdviceData {
  advice: string;
}