export interface Associate {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  roles: string[];
  status: 'confirmed' | 'pending';
}
