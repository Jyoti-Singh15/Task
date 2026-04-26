import React, { useState, useEffect } from 'react';

const App = () => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('internNavyProjectsData');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('internNavyProjectsData', JSON.stringify(projects));
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    } else if (projects.length === 0) {
      setSelectedProjectId(null);
    }
  }, [projects, selectedProjectId]);

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const newProject = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      tasks: []
    };
    setProjects([...projects, newProject]);
    setNewProjectName('');
    setSelectedProjectId(newProject.id);
  };

  const handleDeleteProject = (projectId, e) => {
    e.stopPropagation();
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    if (selectedProjectId === projectId) {
      setSelectedProjectId(updatedProjects.length > 0 ? updatedProjects[0].id : null);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim() || !selectedProjectId) return;
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProjectId) {
        return {
          ...project,
          tasks: [...project.tasks, { id: Date.now().toString(), text: newTaskInput.trim(), completed: false, note: '' }]
        };
      }
      return project;
    });
    setProjects(updatedProjects);
    setNewTaskInput('');
  };

  const updateTaskNote = (projectId, taskId, note) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, note } : task
          )
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const toggleTask = (projectId, taskId) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const deleteTask = (projectId, taskId) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.filter(task => task.id !== taskId)
        };
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 selection:bg-blue-200 selection:text-blue-900 font-sans relative overflow-hidden">

      {/* Light & Navy Blue Abstract background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>

      <div className="w-full max-w-[550px] bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(15,23,42,0.1)] rounded-[2.5rem] border border-white/60 flex flex-col relative z-10 max-h-[90vh] pb-0 overflow-hidden">

        {/* Header */}
        <div className="p-8 pb-5 flex flex-col justify-center shrink-0 bg-blue-900 rounded-t-[2.5rem] shadow-md z-20">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-blue-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            Tasks
          </h1>
          <p className="text-blue-200 font-medium text-sm tracking-wide">projects organizer.</p>
        </div>

        {/* Project Selector section */}
        <div className="px-6 pb-2 shrink-0 border-b border-gray-100 bg-white shadow-sm z-10 relative">
          <form onSubmit={handleAddProject} className="flex gap-2 my-4">
            <input
              type="text"
              placeholder="Add a new website..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400 font-bold text-slate-800"
            />
            <button
              type="submit"
              disabled={!newProjectName.trim()}
              className="px-6 py-3.5 bg-blue-900 text-white rounded-2xl font-black text-sm hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            >
              Add
            </button>
          </form>

          {/* Pill-shaped scrolling tab bar for websites */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 pt-1 px-2 -mx-2">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`flex-shrink-0 relative group cursor-pointer px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border select-none flex items-center gap-2 overflow-hidden ${selectedProjectId === project.id
                  ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-blue-300 text-slate-500 hover:text-blue-800'
                  }`}
              >
                <span className="relative z-10">{project.name}</span>

                <button
                  onClick={(e) => handleDeleteProject(project.id, e)}
                  className={`absolute -top-1 -right-1 w-5 h-5 bg-red-50 border border-red-100 rounded-full text-red-500 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all font-bold text-[10px] z-20`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Task Area for Selected Project */}
        <div className="bg-slate-50 p-6 flex-1 overflow-hidden flex flex-col relative">

          {!selectedProject ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-blue-200 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
              <p className="text-slate-800 font-extrabold text-xl mb-1">No Selection</p>
              <p className="text-slate-500 font-medium text-sm">Select or add a website project to get started.</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleAddTask} className="relative mb-5 shrink-0 z-10">
                <textarea
                  placeholder="What's the next task?"
                  value={newTaskInput}
                  onChange={(e) => {
                    setNewTaskInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddTask(e);
                      e.target.style.height = 'auto';
                    }
                  }}
                  rows={1}
                  className="w-full pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all text-[15px] font-bold placeholder:text-slate-300 text-slate-800 resize-none overflow-hidden"
                />
                <button
                  type="submit"
                  disabled={!newTaskInput.trim()}
                  className="absolute right-2 bottom-2 p-2.5 bg-blue-100 text-blue-900 rounded-xl hover:bg-blue-900 hover:text-white disabled:opacity-40 disabled:hover:bg-blue-100 disabled:hover:text-blue-900 transition-all active:scale-95 duration-200 font-black"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
                  </svg>
                </button>
              </form>

              <div className="flex gap-2 mb-5 shrink-0 overflow-x-auto no-scrollbar">
                {['all', 'remaining', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all border ${filter === f
                      ? 'bg-blue-900 border-blue-900 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-800'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 no-scrollbar pb-2 relative z-0">
                {(() => {
                  const filteredTasks = selectedProject.tasks.filter(task => {
                    if (filter === 'completed') return task.completed;
                    if (filter === 'remaining') return !task.completed;
                    return true;
                  });

                  if (filteredTasks.length === 0) {
                    return (
                      <div className="text-center py-10 flex flex-col items-center">
                        <p className="text-slate-500 font-medium">No {filter !== 'all' ? filter : ''} tasks found.</p>
                      </div>
                    );
                  }

                  return (
                    <ul className="space-y-3">
                      {filteredTasks.map(task => (
                        <li
                          key={task.id}
                          className={`group flex flex-col p-4 bg-white rounded-2xl border transition-all duration-300 ${task.completed
                            ? 'border-transparent bg-slate-100/50 opacity-70'
                            : 'border-slate-100 shadow-sm hover:border-blue-200'
                            }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <label className="flex items-center gap-4 cursor-pointer flex-1 min-w-0">
                              <div className="relative flex items-center justify-center shrink-0">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => toggleTask(selectedProject.id, task.id)}
                                  className="peer sr-only"
                                />
                                <div className={`w-7 h-7 border-2 rounded-xl bg-white transition-all duration-300 flex items-center justify-center peer-focus-visible:ring-4 peer-focus-visible:ring-blue-400/30 ${task.completed ? 'border-blue-900 bg-blue-900' : 'border-slate-300 peer-checked:bg-blue-900 peer-checked:border-blue-900 group-hover:border-blue-300'}`}>
                                  <svg
                                    className={`w-4 h-4 text-white transform transition-transform duration-300 ${task.completed ? 'scale-100' : 'scale-0'}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>

                              <span
                                className={`font-semibold text-[15px] transition-all duration-300 break-words flex-1 whitespace-pre-wrap ${task.completed
                                  ? 'text-slate-400 line-through decoration-slate-300 decoration-[2px]'
                                  : 'text-slate-800'
                                  }`}
                              >
                                {task.text}
                              </span>
                            </label>

                            <button
                              onClick={() => deleteTask(selectedProject.id, task.id)}
                              className={`shrink-0 ml-3 p-2 text-slate-300 hover:text-white hover:bg-slate-400 rounded-xl transition-all duration-200 ${task.completed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          {/* Task Note Input */}
                          <div className="mt-3 pl-11">
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all border ${task.completed
                                ? 'bg-slate-50/50 border-slate-100'
                                : 'bg-blue-50/30 border-blue-100/50 focus-within:border-blue-200 focus-within:bg-blue-50/50'
                              }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 shrink-0 ${task.completed ? 'text-slate-300' : 'text-blue-400'}`}>
                                <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.53a.75.75 0 00-.627.74v11.903c0 .384.273.713.648.746a41.147 41.147 0 013.693.48c.502.081.767.615.511 1.05-.277.472-.7.88-1.208 1.107a.75.75 0 00.437 1.409c1.531-.474 2.416-1.64 2.416-2.868v-1.05c0-.469.352-.886.811-.966a29.058 29.058 0 001.9-.397.75.75 0 00.511-.74V3.27a.75.75 0 00-.626-.739A41.15 41.15 0 0010 2z" clipRule="evenodd" />
                              </svg>
                              <textarea
                                placeholder="Add a note..."
                                value={task.note || ''}
                                onChange={(e) => {
                                  updateTaskNote(selectedProject.id, task.id, e.target.value);
                                  e.target.style.height = 'auto';
                                  e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    e.target.blur();
                                  }
                                }}
                                rows={1}
                                className={`w-full bg-transparent border-none p-0 text-[13px] font-bold focus:outline-none placeholder:text-slate-400 transition-all resize-none overflow-hidden whitespace-pre-wrap ${task.completed ? 'text-slate-400' : 'text-slate-700 focus:text-blue-900'
                                  }`}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
