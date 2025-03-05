export interface DoctorPersonalInfo {
  id: number;
  doctor_id: number;
  name: string;
  date_of_birth: string;
  gender: string;
  degree: string;
  specialization: string;
  license_number: string;
  phone_number: string;
  profile_photo?: string | File;
  nationality: string;
  languages_spoken: string;
  created_at?: Date;
  current_hospital_clinic: string;
  experience: string;
  previous_workplaces: string;
  internship_residency_details: string;
  consultation_fees: number;
  payment_methods_accepted: string;
  time_of_one_appointment: string;
  online_consultation_availability: number;
  walk_in_availability: number;
  appointment_booking_required: number;
}
