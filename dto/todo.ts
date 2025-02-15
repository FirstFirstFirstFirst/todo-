export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  imageUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TodoFormData {
  text: string;
  imageUrl?: string;
}
