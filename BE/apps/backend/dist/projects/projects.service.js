"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../common/supabase.client");
let ProjectsService = class ProjectsService {
    async getProjectById(id, userId) {
        const { data: project, error } = await supabase_client_1.supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error)
            throw error;
        return project;
    }
    async createProject(userId, data) {
        const { data: project, error } = await supabase_client_1.supabase
            .from('projects')
            .insert([
            {
                user_id: userId,
                name: data.name,
                description: data.description,
                theme_color: data.themeColor,
                due_date: data.dueDate,
            },
        ])
            .select()
            .single();
        if (error)
            throw error;
        return project;
    }
    async getProjects(userId) {
        const { data, error } = await supabase_client_1.supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId);
        if (error)
            throw error;
        return data;
    }
    async updateProject(id, userId, data) {
        const { data: project, error } = await supabase_client_1.supabase
            .from('projects')
            .update({
            name: data.name,
            description: data.description,
            theme_color: data.themeColor,
            due_date: data.dueDate,
        })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();
        if (error)
            throw error;
        return project;
    }
    async deleteProject(id, userId) {
        const { error } = await supabase_client_1.supabase
            .from('projects')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error)
            throw error;
        return { message: 'Project deleted' };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)()
], ProjectsService);
//# sourceMappingURL=projects.service.js.map