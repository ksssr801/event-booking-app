export interface Category {
  id: number;
  name: string;
}

export interface Booking {
  id?: number;
  user_id: number;
  timeslot: number;
  booked_at?: string;
}

export interface TimeSlot {
  id: number;
  category: number;
  category_name: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  user_booked: boolean;
}

export interface SlotCreateRequest {
  category: number | string;
  start_time: string;
  end_time: string;
}
