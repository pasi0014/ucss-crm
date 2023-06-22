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


export interface DonorFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IColumnProps {
  header: string,
  accessor: string,
  render?: (value: any, items: any) => React.ReactNode;
}