export interface Phone {
  number: string;
}

export interface Contact {
  created_at: string;
  id: number;
  name: string;
  phones: Phone[];
  first_name?: string;
  last_name?: string;
}

export interface GetContactListResponse {
  contact: Contact[];
}
