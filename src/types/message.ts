export interface Message {
  id: string;
  content: string;
  created_at: string;
  is_ai: boolean;
  user_id: string;
  home_id: string;
}