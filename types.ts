export interface Member {
  id?: number;
  full_name: string;
  email: string;
  skills: string;
  status: 'Active' | 'Inactive';
  created_at?: string;
}

// Matches public.expected_tasks in screenshot
export interface ExpectedTask {
  id: number;
  description: string;
  deadline: string;
  note?: string;
  created_at?: string;
}

export interface TaskInput {
  description: string;
  deadline: string;
  note: string;
}

// Updated to match the "tasks" table schema provided in the screenshot
export interface DbTask {
  id: number;
  task_id?: string;
  task_name?: string;  // Corrected from title
  assignee?: string;   // Corrected from assignee_name
  email?: string;      // Corrected from assignee_email
  status?: string;
  deadline?: string;
  reasoning?: string;
  reminder?: string;
  start?: string;      // Corrected from start_date
  end?: string;        // Corrected from end_date
  time_h?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssignedTask {
  taskName: string; 
  assignee: string;
  email: string;
  reasoning: string;
  deadline: string;
  originalTaskId?: number;
}

export interface AssignmentResponse {
  success: boolean;
  data: AssignedTask[];
  message?: string;
}