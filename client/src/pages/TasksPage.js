import { useState, useEffect } from 'react';
import httpClient from '../httpClient';
import { url } from '../url';
import Task from '../components/Task';
import Header from '../components/Header';

const TasksPage = () => {
  const loggedIn = localStorage.getItem('loggedIn');
  if (!loggedIn) {
    window.location.href = '/';
  }

  const [tasks, setTasks] = useState(null);
  const [user, setUser] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [addTaskLoad, setAddTaskLoad] = useState(false);

  const onDelete = async (id) => {
    try {
      const resp = await httpClient.delete(`${url}/@me/task`, {
        data: {
          id: id,
        },
      });
      setTasks(resp.data);
    } catch (error) {
      alert('There has been an error deleting your task. Please try again');
      window.location.href = '/tasks';
    }
  };

  const addTask = async () => {
    if (newTask) {
      try {
        setAddTaskLoad(true);
        const resp = await httpClient.post(`${url}/@me/task`, {
          task: newTask,
        });
        setTasks(resp.data);
        setNewTask('');
        setAddTaskLoad(false);
      } catch (error) {
        alert('There has been an error adding your task. Please try again');
        window.location.href = '/tasks';
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get(`${url}/@me`);
        setUser(resp.data);
      } catch (error) {
        localStorage.removeItem('loggedIn');
        window.location.href = '/tasks';
        alert('Session expired, you have been logged out');
      }
    })();
    (async () => {
      try {
        const resp = await httpClient.get(`${url}/@me/tasks`);
        setTasks(resp.data);
      } catch (error) {
        console.log('Not authenticated');
      }
    })();
  }, []);

  return (
    <>
      <Header user={user} />
      <div className='task_container'>
        <div className='add_task'>
          <input
            type='text'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          {addTaskLoad ? (
            <div className='loader_m' />
          ) : (
            <button onClick={() => addTask()}>Add task</button>
          )}
        </div>
        {tasks &&
          tasks.map((task) => (
            <Task key={task.id} task={task} onDelete={onDelete} />
          ))}
      </div>
    </>
  );
};

export default TasksPage;
