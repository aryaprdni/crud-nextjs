export interface User {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  address: Address | null;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface CreateUserInput {
  firstname: string;
  lastname: string;
  birthdate: string;
  address: Address;
}
