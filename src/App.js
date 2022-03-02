import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import Footer from './components/Footer';
import About from './components/About';

const App = () => {

  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []); // Params to the request are passed in here

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    return data;
  };

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    return data;
  };

  // Show add task form
  const showTaskForm = () => {
    setShowAddTask(!showAddTask);
  };

  // Add task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(task)
      });

    const newTask = await res.json();
    // const id = Math.floor(Math.random() * 1000) + 1
    // const newTask = {id, ...task}
    setTasks([...tasks, newTask]);
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    });
    let filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    taskToToggle.reminder = !taskToToggle.reminder;

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(taskToToggle)
    });

    await res.json();

    let newTasks = tasks.map((task) => task.id === id ? {...task, reminder: !task.reminder} : task );
    setTasks(newTasks);
  };

  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path='/' element={
            <>
              <div className='container'>
                <Header title="Task List" showTaskForm={showTaskForm} showAddTask={showAddTask}/>
                {showAddTask && <AddTask onAdd={addTask} />}
                {
                  tasks.length > 0 ? 
                    <Tasks 
                      tasks={tasks} 
                      onDelete={deleteTask}
                      onToggle={toggleReminder}
                    /> 
                    : 
                    'No Tasks To Show'
                }
                
                <Footer />
              </div>
            </>
          }
          />
          <Route path='/about' element={<About/>} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
};

export default App;
