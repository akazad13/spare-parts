export interface AddressData {
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postCode: number;
  email: string;
  phone: string;
  addressType: number;
}

export interface Address extends AddressData {
  id: number;
}
