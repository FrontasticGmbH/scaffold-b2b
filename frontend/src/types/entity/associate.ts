export interface Associate {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: string;
  status: 'confirmed' | 'pending';
}
