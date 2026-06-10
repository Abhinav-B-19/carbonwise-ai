export interface RegisterRequest {
    name: string;
    email: string;
    preferredGoal: string;
  }
  
  export interface RegisterResponse {
    userKey: string;
  }