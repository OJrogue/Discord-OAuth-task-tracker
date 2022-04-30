import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Task = ({ task, onDelete }) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className='task'>
      {task.task}
      {loading ? (
        <button className='close'>
          <div className='loader_small' />
        </button>
      ) : (
        <button
          className='close'
          onClick={() => {
            onDelete(task.id);
            setLoading(true);
          }}
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default Task;
