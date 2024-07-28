import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import { STATUS_ORDER } from './constants';
import '../style/home.css';

const Home = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('');
    const [taskCounts, setTaskCounts] = useState({});

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('https://taskmaster-backend-w4e5.onrender.com/api/task');
                setTasks(response.data.tasks);
                setLoading(false);
            } catch (err) {
                setError('An error occurred while fetching tasks.');
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const groupTasksByStatus = (tasks) => {
        const groupedTasks = STATUS_ORDER.reduce((acc, status) => {
            acc[status] = [];
            return acc;
        }, {});
        tasks.forEach(task => {
            if (groupedTasks[task.status]) {
                groupedTasks[task.status].push(task);
            } else {
                console.warn(`Unexpected status: ${task.status}`);
            }
        });
        return groupedTasks;
    };

    const groupedTasks = groupTasksByStatus(tasks);

    useEffect(() => {
        const searchTask = async () => {
            if (searchTerm.trim() === '') {
                const res = await axios.get('https://taskmaster-backend-w4e5.onrender.com/api/task');
                setTasks(res.data.tasks);
            } else {
                try {
                    const res = await axios.get(`https://taskmaster-backend-w4e5.onrender.com/api/search?term=${searchTerm}`);
                    setTasks(res.data.tasks);
                } catch (err) {
                    console.error(err.response.data);
                }
            }
        };
        searchTask();
    }, [searchTerm]);

    useEffect(() => {
        const FilterTask = async () => {
            if (status.trim() === '') {
                const res = await axios.get('https://taskmaster-backend-w4e5.onrender.com/api/task');
                setTasks(res.data.tasks);
            } else {
                try {
                    const res = await axios.get(`https://taskmaster-backend-w4e5.onrender.com/api/getTaskByStatus/${status}`);
                    setTasks(res.data.tasks);
                } catch (err) {
                    console.error(err.response.data);
                }
            }
        };
        FilterTask();
    }, [status]);

    useEffect(() => {
        const fetchTaskCounts = async () => {
            try {
                const statuses = STATUS_ORDER;
                const counts = {};
                for (const status of statuses) {
                    const response = await axios.get(`https://taskmaster-backend-w4e5.onrender.com/api/countTaskByStatus/${status}/${searchTerm}`);
                    counts[status] = response.data.count;
                }
                setTaskCounts(counts);
            } catch (error) {
                console.error('Error fetching task counts:', error);
            }
        };
        fetchTaskCounts();
    }, [tasks, searchTerm]);

    const moveTask = useCallback(async (taskId, newStatus) => {
        const task = tasks.find(task => task._id === taskId);
        if (!task) return;
        const currentStatusIndex = STATUS_ORDER.indexOf(task.status);
        const newStatusIndex = STATUS_ORDER.indexOf(newStatus);
        if (newStatusIndex < currentStatusIndex) {
            return;
        }
        const updatedTasks = tasks.map(task =>
            task._id === taskId ? { ...task, status: newStatus } : task
        );
        try {
            await axios.put(`https://taskmaster-backend-w4e5.onrender.com/api/updateStatusById/${taskId}`, { status: newStatus });
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    }, [tasks]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://taskmaster-backend-w4e5.onrender.com/api/deleteTaskById/${id}`);
            alert('Task deleted successfully...');
            setTasks(tasks.filter(task => task._id !== id));
        } catch (err) {
            console.error(err.response.data);
            setError('An error occurred while deleting the task.');
        }
    };

    const openPopup = (task) => {
        setSelectedTask(task);
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
        setSelectedTask(null);
    };

    const handleEdit = (id) => {
        navigate(`/editTask/${id}`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <Container className='mt-5'>
            <a href='/addtask' className='btn btn-primary float-end'>Create Task</a>
            <h2>Task Dashboard</h2><br />
            <form className="mb-4">
                <div className='input-group'>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Task..."
                        value={searchTerm}
                        style={{ width: '60%', marginRight: '40px' }}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select
                        id="status"
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">Filter by Status</option>
                        {STATUS_ORDER.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </form>
            <br/>
            <DndProvider backend={HTML5Backend}>
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                <Row className="flex-nowrap">
                    {STATUS_ORDER.map(status => (
                        <Col key={status} sm={8} md={5} lg={3} lx={5} className="mb-4">
                            <Column
                                status={status}
                                tasks={groupedTasks[status]}
                                moveTask={moveTask}
                                taskCounts={taskCounts}
                                handleDelete={handleDelete}
                                handleEdit={handleEdit}
                                openPopup={openPopup}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
            </DndProvider>
            {popupOpen && (
                <Popup open={popupOpen} onClose={closePopup} position="right center" className='rounded-lg'>
                    <div>
                        <h2>{selectedTask?.title}</h2>
                        <p>Status: {selectedTask?.status}</p>
                        <p>Date: {selectedTask?.date ? new Date(selectedTask.date).toLocaleDateString() : ''}</p>
                        <p>{selectedTask?.description}</p>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </Popup>
            )}
        </Container>
    );
};

export default Home;
