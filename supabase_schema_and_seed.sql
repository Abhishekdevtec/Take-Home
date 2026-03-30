-- Create users table
create table if not exists public.users (
  id uuid primary key,
  email text not null,
  name text
);

-- Create projects table
create table if not exists public.projects (
  id uuid primary key,
  name text not null,
  description text,
  themeColor text,
  user_id uuid references public.users(id)
);

-- Create tasks table
create table if not exists public.tasks (
  id uuid primary key,
  title text not null,
  description text,
  dueDate date,
  status text,
  project_id uuid references public.projects(id),
  user_id uuid references public.users(id)
);

-- Seed example data
insert into public.users (id, email, name)
values ('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo User')
on conflict (id) do nothing;

insert into public.projects (id, name, description, themeColor, user_id)
values (
  '00000000-0000-0000-0000-000000000101',
  'Demo Project',
  'A sample project for testing',
  '#FF5733',
  '00000000-0000-0000-0000-000000000001'
)
on conflict (id) do nothing;

insert into public.tasks (id, title, description, dueDate, status, project_id, user_id)
values (
  '00000000-0000-0000-0000-000000001001',
  'Demo Task',
  'This is a sample task',
  '2026-04-01',
  'todo',
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000001'
)
on conflict (id) do nothing;
