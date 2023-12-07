export interface Props {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onNavigate: () => void;
}
