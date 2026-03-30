export declare class TasksService {
    createTask(projectId: string, data: any): Promise<any>;
    getTasks(projectId: string): Promise<any[]>;
    updateTask(taskId: string, data: any): Promise<any>;
    deleteTask(taskId: string): Promise<{
        message: string;
    }>;
}
