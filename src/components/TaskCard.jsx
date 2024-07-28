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

    const buttonStyle = {
        background: 'black',
        height: '34px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        marginTop: '-50px',
        marginBottom: '10px',
        border:'none',
        outline: 'none',
      };
      
      const iconStyle = {
        marginBottom: '15px',
        color: 'white',
      };
      const cardBodyStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        whiteSpace: 'normal',
        overflow: 'hidden',
        height: 'auto',
      };
    return (
        <Card ref={drag} className={`mb-2 ${isDragging ? 'dragging' : ''} animated-card shadow-sm`}>
            <Card.Body style={cardBodyStyle}>
                {task.title}
            </Card.Body>
            <Card.Footer className="">
            <small>Created on {new Date(task.date).toLocaleDateString()}</small>
                <div className='float-start mt-1'>
                        <Button
                            onClick={() => openPopup(task)}
                             className="btn-icon p-2 m-1"
                            style={buttonStyle}
                            aria-label="View"
                        >
                            <FaEye style={iconStyle} />
                        </Button>
                        <Button
                            onClick={() => handleEdit(task._id)}
                            className="btn-icon p-2 m-1"
                            style={buttonStyle}
                            aria-label="Edit"
                        >
                            <FaEdit style={iconStyle} />
                        </Button>
                        <Button
                            onClick={() => handleDelete(task._id)}
                            className="btn-icon p-2 m-1"
                            style={buttonStyle}
                            aria-label="Delete"
                        >
                            <FaTrash style={iconStyle} />
                        </Button>
                    </div>
            </Card.Footer>
        </Card>
    );
};

export default TaskCard;
