import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './constants';
import { Card, Badge } from 'react-bootstrap';
import TaskCard from './TaskCard';

const Column = ({ status, taskCounts, tasks, moveTask, handleDelete, handleEdit, openPopup }) => {
    const [, drop] = useDrop(() => ({
        accept: ItemTypes.CARD,
        drop: (item) => moveTask(item.id, status),
    }), [status, moveTask]);

    return (
        <div ref={drop} className="column" style={{ background: '#ededed', padding: '10px', minHeight: '400px', height: 'auto', borderRadius: '6px' }}>
            <div className="d-flex align-items-center mb-2">
                <span className="column-title">{status}</span>
                <Badge pill bg={taskCounts[status] > 0 ? 'primary' : 'secondary'} style={{marginLeft:'6px'}}>
                    {taskCounts[status] || '0'}
                </Badge>
            </div>
            <hr />
            {tasks.map((task) => (
                <TaskCard
                    key={task._id}
                    task={task}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    openPopup={openPopup}
                />
            ))}
        </div>
    );
};

export default Column;
