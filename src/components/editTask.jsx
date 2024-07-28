import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditTask = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('Todo');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/task/${id}`);
                const taskData = response.data.task;
                setTitle(taskData.title || '');
                setStatus(taskData.status || '');
                setDescription(taskData.description || '');
                setDate(taskData.date ? new Date(taskData.date).toISOString().split('T')[0] : '');
            } catch (error) {
                console.error("Error fetching invoice:", error);
            }
        };
        fetchTask();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/updateTaskById/${id}`, {
                title,
                status,
                description,
                date
            });
            alert('Task updated successfully');
            setTitle('');
            setStatus('Pending');
            setDescription('');
        } catch (error) {
            console.error("Error updating invoice:", error);
        }
    };
    return (
        <div className="container mt-5">
            <a href="/" className='btn btn-primary float-end' >Dashboard</a>
            <h2>Update Task</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        type="text"
                        id="title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                        id="status"
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="In Review">In Review</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input
                        type="date"
                        id="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Edit Task</button>
            </form>
        </div>
    )
}

export default EditTask;