export declare class ProjectsService {
    getProjectById(id: string, userId: string): Promise<any>;
    createProject(userId: string, data: any): Promise<any>;
    getProjects(userId: string): Promise<any[]>;
    updateProject(id: string, userId: string, data: any): Promise<any>;
    deleteProject(id: string, userId: string): Promise<{
        message: string;
    }>;
}
