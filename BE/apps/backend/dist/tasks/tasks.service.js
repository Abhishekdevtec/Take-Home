"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../common/supabase.client");
let TasksService = class TasksService {
    async createTask(projectId, data) {
        const { data: task, error } = await supabase_client_1.supabase
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
        if (error)
            throw error;
        return task;
    }
    async getTasks(projectId) {
        const { data, error } = await supabase_client_1.supabase
            .from('tasks')
            .select('*')
            .eq('project_id', projectId);
        if (error)
            throw error;
        return data;
    }
    async updateTask(taskId, data) {
        const { data: task, error } = await supabase_client_1.supabase
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
        if (error)
            throw error;
        return task;
    }
    async deleteTask(taskId) {
        const { error } = await supabase_client_1.supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);
        if (error)
            throw error;
        return { message: 'Deleted' };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)()
], TasksService);
//# sourceMappingURL=tasks.service.js.map