export interface UserInterface {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_photo?: string | File;
  date_of_birth: string;
  gender: string;
  created_at?: Date;
  medical_history: string;
  address: string;
  blood_group: string;
  phone_number: string;
  weight: string;
}
