import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(req: any, body: any): Promise<any>;
    getById(id: string, req: any): Promise<any>;
    getAll(req: any): Promise<any[]>;
    update(id: string, body: any, req: any): Promise<any>;
    delete(id: string, req: any): Promise<{
        message: string;
    }>;
}
