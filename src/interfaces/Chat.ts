export default interface Chat {
  dialog_id: number;
  title: string | null;
  model: string;
  created_at: string;  // Add this property
  updated_at: string | null;  // Add this property
}
