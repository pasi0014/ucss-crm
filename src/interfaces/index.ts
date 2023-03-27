export interface User {
  name: string;
  email: string;
  authToken?: string;
}

export interface ILoggedInUser {
  id: String;
  firstName: String;
  lastName: String;
  email: String;
  role?: String;
}
