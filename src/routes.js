import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query;

      const searchData = search ? {
        title: search,
        description: search
      } : null;

      const tasks = database.select('tasks', searchData);

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const user = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', user);

      return res.writeHead(201).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({ message: "Title and description are required" })
        );
      }

      const task = database.select('tasks', { id });

      if (task.length < 1) {
        return res.writeHead(404).end(
          JSON.stringify({ message: "Task not found, a valid id is required" })
        );
      }

      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date()
      });

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.select('tasks', { id });

      if (task.length < 1) {
        return res.writeHead(404).end(
          JSON.stringify({ message: "Task not found, a valid id is required" })
        );
      }

      const isComplete = task[0].completed_at === null ? new Date() : null;

      database.update('tasks', id, {
        completed_at: isComplete,
        updated_at: new Date()
      });

      return res.writeHead(204).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete('tasks', id);

      return res.writeHead(204).end();
    }
  }
]