export interface Address {
  id: number;
  user_id: number;
  street: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  address: Address;
}
