export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
  active: boolean;
  theme: string;
  createdBy: string;
  createdOn: any;
  modifiedBy: string;
  modifiedOn: any;
  companyName: string;
  country: string;
  address: string;
  city: string;
  state: string;
  postCode: string;

  creatorName: string;
  modifierName: string;
}
