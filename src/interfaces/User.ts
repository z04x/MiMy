export default interface User {
  user_id: number;
  username: string;
  full_name: string;
  active: boolean;
  subscription: {
    subscription_type: string;
    available_generations: number;
    start_date: string;
    end_date: string;
  };
}