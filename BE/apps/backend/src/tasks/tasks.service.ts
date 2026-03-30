import { Injectable } from '@nestjs/common';
import { supabase } from '../common/supabase.client';

@Injectable()
export class TasksService {

  async createTask(projectId: string, data: any) {
    const { data: task, error } = await supabase
      .from('tasks')
      .insert([
        {
          project_id: projectId,
          title: data.title,
          description: data.description,
          status: data.status || 'Todo',
          priority: data.priority || 'Medium',
          due_date: data.dueDate,
          assignee: data.assignee,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return task;
  }

  async getTasks(projectId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;

    return data;
  }

  async updateTask(taskId: string, data: any) {
    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        due_date: data.dueDate,
        assignee: data.assignee,
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    return task;
  }

  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;

    return { message: 'Deleted' };
  }
}