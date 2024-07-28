import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './constants';

const TaskCard = ({ task, handleDelete, handleEdit, openPopup }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.CARD,
        item: { id: task._id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [task]);

    return (
        <Card ref={drag} className={`mb-2 ${isDragging ? 'dragging' : ''} animated-card shadow-sm`}>
            <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                    {task.title}
                    <div>
                        <Button
                            variant="info"
                            onClick={() => openPopup(task)}
                            className="btn-icon p-2 m-1"
                            aria-label="View"
                        >
                            <FaEye />
                        </Button>
                        <Button
                            variant="warning"
                            onClick={() => handleEdit(task._id)}
                            className="btn-icon p-2 m-1"
                            aria-label="Edit"
                        >
                            <FaEdit />
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => handleDelete(task._id)}
                            className="btn-icon p-2 m-1"
                            aria-label="Delete"
                        >
                            <FaTrash />
                        </Button>
                    </div>
                </Card.Title>
            </Card.Body>
            <Card.Footer className="text-muted">
                <small>Created on {new Date(task.date).toLocaleDateString()}</small>
            </Card.Footer>
        </Card>
    );
};

export default TaskCard;
