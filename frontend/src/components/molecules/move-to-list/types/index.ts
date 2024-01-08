export type MoveToListProps = {
  lists: { label: string; id: string }[];
  onSubmit?: (selected: string[]) => Promise<void>;
};
