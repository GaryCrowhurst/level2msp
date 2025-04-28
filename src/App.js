// MotorsportPortfolio Component - Browser Compatible Version
function MotorsportPortfolio({ onNavigateToTurboLearn }) {
    // Using React from global namespace
    const { useState, useEffect, useRef } = React;
    
    // Import icons from Lucide
    const { 
      Camera, Save, Home, Folder, BookOpen, Check, X, Upload, 
      Plus, ChevronRight, ChevronDown, Edit, Download, Image, 
      CheckCircle, FileText 
    } = lucide;
  
    const [currentView, setCurrentView] = useState('home');
    const [portfolio, setPortfolio] = useState(null);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    
    // Load data on initial render
    useEffect(() => {
      // Initialize with empty portfolio immediately to prevent null errors
      const initialPortfolio = {
        learnerName: '',
        learnerID: '',
        assessments: []
      };
      setPortfolio(initialPortfolio);
      
      // Then try to load from localStorage
      const savedPortfolio = localStorage.getItem('motorsportPortfolio');
      if (savedPortfolio) {
        try {
          const parsed = JSON.parse(savedPortfolio);
          setPortfolio(parsed);
        } catch (e) {
          console.error("Error parsing saved portfolio", e);
        }
      }
      
      setInitialLoad(false);
    }, []);
    
    // Save portfolio data whenever it changes
    useEffect(() => {
      if (portfolio && !initialLoad) {
        try {
          localStorage.setItem('motorsportPortfolio', JSON.stringify(portfolio));
          console.log("Portfolio saved to localStorage");
        } catch (e) {
          console.error("Error saving portfolio to localStorage", e);
        }
      }
    }, [portfolio, initialLoad]);
    
    // View handlers
    const openAssessment = (assessment) => {
      setSelectedAssessment(assessment);
      setCurrentView('assessment');
    };
    
    const createNewAssessment = (type) => {
      const newAssessment = createEmptyAssessment(type);
      const updatedPortfolio = {
        ...portfolio,
        assessments: [...portfolio.assessments, newAssessment]
      };
      setPortfolio(updatedPortfolio);
      setSelectedAssessment(newAssessment);
      setCurrentView('assessment');
    };
    
    const saveAssessment = (updatedAssessment) => {
      console.log("Saving assessment:", updatedAssessment);
      const updatedAssessments = portfolio.assessments.map(assessment => 
        assessment.id === updatedAssessment.id ? updatedAssessment : assessment
      );
      setPortfolio({
        ...portfolio,
        assessments: updatedAssessments
      });
      setSelectedAssessment(updatedAssessment);
    };
    
    const updateLearnerInfo = (name, id) => {
      setPortfolio({
        ...portfolio,
        learnerName: name,
        learnerID: id
      });
    };
    
    // Render appropriate view
    const renderCurrentView = () => {
      // Show loading if portfolio isn't loaded yet
      if (!portfolio) {
        return <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading portfolio...</p>
        </div>;
      }
      
      switch(currentView) {
        case 'home':
          return <HomePage 
                   portfolio={portfolio} 
                   updateLearnerInfo={updateLearnerInfo}
                   openAssessment={openAssessment}
                   createNewAssessment={createNewAssessment}
                 />;
  
        case 'assessment':
          return <AssessmentPage 
                   assessment={selectedAssessment}
                   learnerName={portfolio?.learnerName || ''}
                   saveAssessment={saveAssessment}
                   goHome={() => setCurrentView('home')}
                 />;
  
        default:
          return <HomePage 
                   portfolio={portfolio} 
                   updateLearnerInfo={updateLearnerInfo}
                   openAssessment={openAssessment}
                   createNewAssessment={createNewAssessment}
                 />;
      }
    };
    
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-800 text-white p-4 shadow-md">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Motorsport Maintenance Portfolio</h1>
            <div className="flex items-center">
              <button 
                onClick={onNavigateToTurboLearn}
                className="mr-4 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded flex items-center text-sm"
              >
                <FileText size={16} className="mr-1" /> Open Turbo Learn
              </button>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden p-2 rounded-full hover:bg-blue-700"
              >
                {showMenu ? <X size={24} /> : <div className="space-y-1 w-6">
                  <div className="w-full h-0.5 bg-white"></div>
                  <div className="w-full h-0.5 bg-white"></div>
                  <div className="w-full h-0.5 bg-white"></div>
                </div>}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {showMenu && (
            <nav className="mt-4 md:hidden">
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {
                      setCurrentView('home');
                      setShowMenu(false);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-blue-700 flex items-center"
                  >
                    <Home size={18} className="mr-2" /> Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('create');
                      setShowMenu(false);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-blue-700 flex items-center"
                  >
                    <Plus size={18} className="mr-2" /> New Assessment
                  </button>
                </li>
                <li>
                  <button
                    onClick={onNavigateToTurboLearn}
                    className="w-full text-left p-2 rounded hover:bg-blue-700 flex items-center"
                  >
                    <FileText size={18} className="mr-2" /> Open Turbo Learn
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </header>
        
        {/* Main Content */}
        <main className="flex-grow p-4">
          {renderCurrentView()}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white p-4 text-center text-sm">
          IMI Level 2 Diploma in Motorsport Vehicle Maintenance and Repair (600/2657/1)
        </footer>
      </div>
    );
  }
  
  // Home Page Component
  function HomePage({ portfolio, updateLearnerInfo, openAssessment, createNewAssessment }) {
    // Guard against null portfolio
    if (!portfolio) return <div className="p-4">Loading portfolio...</div>;
    
    const [isEditing, setIsEditing] = useState(!portfolio.learnerName);
    const [name, setName] = useState(portfolio.learnerName || '');
    const [id, setId] = useState(portfolio.learnerID || '');
    const [showAssessmentTypes, setShowAssessmentTypes] = useState(false);
    
    const saveInfo = () => {
      updateLearnerInfo(name, id);
      setIsEditing(false);
    };
    
    // Calculate completion statistics
    const getCompletionStats = () => {
      if (!portfolio || !portfolio.assessments || !portfolio.assessments.length) {
        return { completed: 0, total: 0, percent: 0 };
      }
      
      const total = portfolio.assessments.length;
      const completed = portfolio.assessments.filter(a => a.isCompleted).length;
      const percent = Math.round((completed / total) * 100);
      
      return { completed, total, percent };
    };
    
    const stats = getCompletionStats();
    
    const assessmentTypes = [
      { id: 'MS0102S', title: 'Health, Safety and Housekeeping' },
      { id: 'MS4S', title: 'Materials, Fabrication, Tools and Measuring' },
      { id: 'MS56.1s', title: 'Engine Systems' },
      { id: 'MS56.2s', title: 'Chassis Systems' },
      { id: 'MS56.3s', title: 'Electrical Systems' },
      { id: 'MS56.4s', title: 'Transmission Systems' },
      { id: 'MS57s', title: 'Vehicle Inspection' }
    ];
    
    return (
      <div className="max-w-4xl mx-auto">
        {/* Learner Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Learner Details</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Edit size={16} className="mr-1" /> Edit
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Learner ID</label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your learner ID"
                />
              </div>
              <button
                onClick={saveInfo}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Details
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-2"><span className="font-medium">Name:</span> {portfolio.learnerName || 'Not set'}</p>
              <p><span className="font-medium">Learner ID:</span> {portfolio.learnerID || 'Not set'}</p>
            </div>
          )}
        </div>
        
        {/* Progress Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Progress</h2>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Completion: {stats.completed}/{stats.total} assessments</span>
              <span>{stats.percent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${stats.percent}%` }}
              ></div>
            </div>
          </div>
          
          {/* Assessment Types */}
          <div className="mt-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowAssessmentTypes(!showAssessmentTypes)}
            >
              <h3 className="text-lg font-medium">Create New Assessment</h3>
              {showAssessmentTypes ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </div>
            
            {showAssessmentTypes && (
              <div className="mt-3 grid grid-cols-1 gap-2">
                {assessmentTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => createNewAssessment(type.id)}
                    className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200"
                  >
                    {type.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Existing Assessments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">My Assessments</h2>
          
          {portfolio.assessments.length > 0 ? (
            <div className="space-y-3">
              {portfolio.assessments.map(assessment => (
                <div 
                  key={assessment.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => openAssessment(assessment)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{assessment.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(assessment.dateCreated).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {assessment.isCompleted ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">In Progress</span>
                      )}
                      <ChevronRight size={16} className="ml-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Folder size={48} className="mx-auto mb-2" />
              <p>No assessments yet. Create your first assessment above.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Assessment Page Component
  function AssessmentPage({ assessment, learnerName, saveAssessment, goHome }) {
    // Guard against null assessment
    if (!assessment) return <div className="p-4">Loading assessment...</div>;
    
    const [currentAssessment, setCurrentAssessment] = useState(assessment);
    const [currentTask, setCurrentTask] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    
    const updateTask = (taskIndex, taskData) => {
      const updatedTasks = [...currentAssessment.tasks];
      updatedTasks[taskIndex] = taskData;
      
      // Check if all tasks are complete
      const allTasksComplete = updatedTasks.every(task => 
        task.isCompleted === true
      );
      
      setCurrentAssessment({
        ...currentAssessment,
        tasks: updatedTasks,
        isCompleted: allTasksComplete
      });
    };
    
    const handleSave = () => {
      setIsLoading(true);
      // Simulate saving delay
      setTimeout(() => {
        saveAssessment(currentAssessment);
        setIsLoading(false);
      }, 500);
    };
    
    // Update vehicle/rig details
    const updateVehicleDetails = (field, value) => {
      setCurrentAssessment({
        ...currentAssessment,
        vehicleDetails: {
          ...(currentAssessment.vehicleDetails || {}),
          [field]: value
        }
      });
    };
    
    // Generate PDF for entire assessment
    const generateAssessmentPDF = () => {
      setIsGeneratingPDF(true);
      
      // Simulating PDF generation - in a real app, you'd use jsPDF or html2pdf
      setTimeout(() => {
        // Convert the assessment to a data structure
        const assessmentData = JSON.stringify(currentAssessment, null, 2);
        
        // Create a Blob with the data
        const blob = new Blob([assessmentData], { type: 'application/json' });
        
        // Create a download link and trigger it
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentAssessment.title.replace(/\s+/g, '_')}_Assessment.json`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsGeneratingPDF(false);
        }, 100);
      }, 1000);
    };
    
    return (
      <div className="max-w-4xl mx-auto">
        {/* Assessment Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <button 
                onClick={goHome}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
              >
                <Home size={16} className="mr-1" /> Back to Home
              </button>
              <h2 className="text-xl font-semibold">{currentAssessment.title}</h2>
              <p className="text-sm text-gray-600">
                Created: {new Date(currentAssessment.dateCreated).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={generateAssessmentPDF}
                disabled={isGeneratingPDF}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                {isGeneratingPDF ? 'Generating...' : <>
                  <Download size={16} className="mr-1" /> Export
                </>}
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                {isLoading ? 'Saving...' : <>
                  <Save size={16} className="mr-1" /> Save
                </>}
              </button>
            </div>
          </div>
          
          {/* Assessment Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Assessment Progress</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                currentAssessment.isCompleted 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentAssessment.isCompleted ? 'Completed' : 'In Progress'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ 
                  width: `${(currentAssessment.tasks.filter(t => t.isCompleted).length / 
                  currentAssessment.tasks.length) * 100}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {currentAssessment.tasks.filter(t => t.isCompleted).length} of {currentAssessment.tasks.length} tasks completed
            </p>
          </div>
          
          {/* Learner Details */}
          <div className="mb-4">
            <p className="font-medium">Learner Name: {learnerName}</p>
            <p className="text-sm text-gray-600">Date of activities: {new Date().toLocaleDateString()}</p>
          </div>
          
          {/* Vehicle Details */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Vehicle/Rig Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Reg No:</label>
                <input
                  type="text"
                  value={currentAssessment.vehicleDetails?.regNo || ''}
                  onChange={(e) => updateVehicleDetails('regNo', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Approx year:</label>
                <input
                  type="text"
                  value={currentAssessment.vehicleDetails?.year || ''}
                  onChange={(e) => updateVehicleDetails('year', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Make:</label>
                <input
                  type="text"
                  value={currentAssessment.vehicleDetails?.make || ''}
                  onChange={(e) => updateVehicleDetails('make', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Model:</label>
                <input
                  type="text"
                  value={currentAssessment.vehicleDetails?.model || ''}
                  onChange={(e) => updateVehicleDetails('model', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Eng/VIN No:</label>
                <input
                  type="text"
                  value={currentAssessment.vehicleDetails?.engVIN || ''}
                  onChange={(e) => updateVehicleDetails('engVIN', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Task Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold mb-3">Tasks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {currentAssessment.tasks.map((task, index) => (
              <button
                key={index}
                onClick={() => setCurrentTask(index)}
                className={`p-3 rounded flex items-center justify-between ${
                  currentTask === index 
                    ? 'bg-blue-600 text-white' 
                    : task.isCompleted 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                <span className="truncate pr-2">{task.name}</span>
                {task.isCompleted && <CheckCircle size={16} />}
              </button>
            ))}
          </div>
        </div>
        
        {/* Current Task */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <TaskForm 
            task={currentAssessment.tasks[currentTask]} 
            updateTask={(taskData) => updateTask(currentTask, taskData)}
          />
        </div>
      </div>
    );
  }
  
  // Task Form Component
  function TaskForm({ task, updateTask }) {
    // Guard against null task
    if (!task) return <div className="p-4">Loading task details...</div>;
    
    const [currentTask, setCurrentTask] = useState(task);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const pdfContainerRef = useRef(null);
    
    // Log task changes
    useEffect(() => {
      console.log("Current task updated:", currentTask);
    }, [currentTask]);
    
    // Update parent component when task changes
    useEffect(() => {
      updateTask(currentTask);
    }, [currentTask, updateTask]);
    
    const handleCheckboxChange = (subtaskIndex, isChecked) => {
      const updatedSubtasks = [...currentTask.subtasks];
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        isCompleted: isChecked
      };
      
      // Check if all subtasks are complete
      const allSubtasksComplete = updatedSubtasks.every(subtask => 
        subtask.isCompleted === true
      );
      
      setCurrentTask({
        ...currentTask,
        subtasks: updatedSubtasks,
        isCompleted: allSubtasksComplete
      });
    };
    
    const addImageToSubtask = (subtaskIndex, file) => {
      // Create a data URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedSubtasks = [...currentTask.subtasks];
        const currentPhotos = updatedSubtasks[subtaskIndex].photos || [];
        
        updatedSubtasks[subtaskIndex] = {
          ...updatedSubtasks[subtaskIndex],
          photos: [...currentPhotos, {
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: e.target.result,
            caption: ''
          }]
        };
        
        setCurrentTask({
          ...currentTask,
          subtasks: updatedSubtasks
        });
      };
      reader.readAsDataURL(file);
    };
    
    const removeImageFromSubtask = (subtaskIndex, photoId) => {
      const updatedSubtasks = [...currentTask.subtasks];
      const currentPhotos = updatedSubtasks[subtaskIndex].photos || [];
      
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        photos: currentPhotos.filter(photo => photo.id !== photoId)
      };
      
      setCurrentTask({
        ...currentTask,
        subtasks: updatedSubtasks
      });
    };
    
    const updatePhotoCaption = (subtaskIndex, photoId, caption) => {
      const updatedSubtasks = [...currentTask.subtasks];
      const currentPhotos = updatedSubtasks[subtaskIndex].photos || [];
      
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        photos: currentPhotos.map(photo => 
          photo.id === photoId ? { ...photo, caption } : photo
        )
      };
      
      setCurrentTask({
        ...currentTask,
        subtasks: updatedSubtasks
      });
    };
    
    const updateNotes = (subtaskIndex, notes) => {
      const updatedSubtasks = [...currentTask.subtasks];
      updatedSubtasks[subtaskIndex] = {
        ...updatedSubtasks[subtaskIndex],
        notes: notes
      };
      
      setCurrentTask({
        ...currentTask,
        subtasks: updatedSubtasks
      });
    };
    
    // Adding work steps functionality
    const addWorkStep = () => {
      const newStep = {
        id: `step-${Date.now()}`,
        description: '',
        photos: []
      };
      
      const currentSteps = currentTask.workSteps || [];
      setCurrentTask({
        ...currentTask,
        workSteps: [...currentSteps, newStep]
      });
    };
    
    const updateWorkStep = (stepId, description) => {
      const updatedSteps = (currentTask.workSteps || []).map(step => 
        step.id === stepId ? { ...step, description } : step
      );
      
      setCurrentTask({
        ...currentTask,
        workSteps: updatedSteps
      });
    };
    
    const removeWorkStep = (stepId) => {
      const updatedSteps = (currentTask.workSteps || []).filter(step => step.id !== stepId);
      
      setCurrentTask({
        ...currentTask,
        workSteps: updatedSteps
      });
    };
    
    const addPhotoToWorkStep = (stepId, file) => {
      // Create a data URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: e.target.result,
          caption: ''
        };
        
        const updatedSteps = (currentTask.workSteps || []).map(step => {
          if (step.id === stepId) {
            const currentPhotos = step.photos || [];
            return {
              ...step,
              photos: [...currentPhotos, newPhoto]
            };
          }
          return step;
        });
        
        setCurrentTask({
          ...currentTask,
          workSteps: updatedSteps
        });
      };
      reader.readAsDataURL(file);
    };
    
    const removePhotoFromWorkStep = (stepId, photoId) => {
      const updatedSteps = (currentTask.workSteps || []).map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            photos: (step.photos || []).filter(photo => photo.id !== photoId)
          };
        }
        return step;
      });
      
      setCurrentTask({
        ...currentTask,
        workSteps: updatedSteps
      });
    };
    
    const updateWorkStepPhotoCaption = (stepId, photoId, caption) => {
      const updatedSteps = (currentTask.workSteps || []).map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            photos: (step.photos || []).map(photo => 
              photo.id === photoId ? { ...photo, caption } : photo
            )
          };
        }
        return step;
      });
      
      setCurrentTask({
        ...currentTask,
        workSteps: updatedSteps
      });
    };
    
    const updateTechnicalData = (field, value) => {
      setCurrentTask({
        ...currentTask,
        technicalData: {
          ...currentTask.technicalData,
          [field]: value
        }
      });
    };
    
    const updatePPE = (ppe) => {
      setCurrentTask({
        ...currentTask,
        ppe: ppe
      });
    };
    
    const updateSpecialTools = (tools) => {
      setCurrentTask({
        ...currentTask,
        specialTools: tools
      });
    };
    
    const updateFurtherFaults = (faults) => {
      setCurrentTask({
        ...currentTask,
        furtherFaults: faults
      });
    };
    
    // Handle PDF generation and download
    const generatePDF = () => {
      setIsGeneratingPDF(true);
      
      // Simulating PDF generation - in a real app, you'd use a library like jsPDF or html2pdf
      setTimeout(() => {
        // Convert the task to a data structure
        const taskData = JSON.stringify(currentTask, null, 2);
        
        // Create a Blob with the data
        const blob = new Blob([taskData], { type: 'application/json' });
        
        // Create a download link and trigger it
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentTask.name.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setIsGeneratingPDF(false);
        }, 100);
      }, 1000);
    };
    
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{currentTask.name}</h2>
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
          >
            {isGeneratingPDF ? 'Generating...' : <>
              <Download size={16} className="mr-1" /> Download Task
            </>}
          </button>
        </div>
        
        {/* Task Status Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Task Status</h3>
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm ${currentTask.isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {currentTask.isCompleted ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm text-gray-500 mb-1">
              Completion: {currentTask.subtasks.filter(s => s.isCompleted).length}/{currentTask.subtasks.length} subtasks
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(currentTask.subtasks.filter(s => s.isCompleted).length / currentTask.subtasks.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Reference container for PDF generation */}
        <div ref={pdfContainerRef} style={{ display: 'none' }}>
          {/* Content that will be converted to PDF */}
        </div>
        
        {/* Customer Request Section */}
        <div className="mb-6">
          <h3 className="font-medium pb-2 border-b border-gray-200 mb-3">Required Tasks</h3>
          <div className="space-y-4">
            {currentTask.subtasks.map((subtask, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-grow">
                    <div 
                      onClick={() => handleCheckboxChange(index, !subtask.isCompleted)}
                      className={`w-6 h-6 rounded-full flex-shrink-0 mr-3 flex items-center justify-center cursor-pointer border ${subtask.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                    >
                      {subtask.isCompleted && <Check size={16} className="text-white" />}
                    </div>
                    <div className="flex-grow">
                      <label 
                        htmlFor={`subtask-${index}`} 
                        className={`font-medium block mb-2 ${subtask.isCompleted ? 'text-green-700' : ''}`}
                      >
                        {subtask.description}
                      </label>
                      
                      <div className="mt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Multiple Photo Evidence */}
                          <div className="flex-1">
                            <div className="mb-2 text-sm font-medium text-gray-700">Photo Evidence:</div>
                            
                            {/* Photo Gallery */}
                            {(subtask.photos && subtask.photos.length > 0) ? (
                              <div className="mb-3">
                                <div className="grid grid-cols-2 gap-2">
                                  {subtask.photos.map((photo, photoIndex) => (
                                    <div key={photo.id} className="relative border rounded-lg overflow-hidden">
                                      <img 
                                        src={photo.url} 
                                        alt={`Photo ${photoIndex + 1} for ${subtask.description}`}
                                        className="w-full h-24 object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeImageFromSubtask(index, photo.id);
                                          }}
                                          className="bg-red-500 text-white p-1 rounded-full"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                      {photo.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                          {photo.caption}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                            
                            {/* Add Photo Button */}
                            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                              <label className="cursor-pointer flex flex-col items-center">
                                <Camera size={24} className="text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">
                                  {subtask.photos && subtask.photos.length > 0 
                                    ? 'Add another photo' 
                                    : 'Add photo evidence'}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      addImageToSubtask(index, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                          
                          {/* Notes */}
                          <div className="flex-1">
                            <div className="mb-2 text-sm font-medium text-gray-700">Task Notes:</div>
                            <textarea
                              value={subtask.notes || ''}
                              onChange={(e) => updateNotes(index, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded h-20 text-sm"
                              placeholder="Add notes about this task..."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
  
          </div>
        </div>
        
        {/* Work Description with Steps */}
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="pb-2 border-b border-gray-200 mb-3">
            <h3 className="font-medium">Work Description</h3>
          </div>
          
          {/* Introduction text area */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea
              value={currentTask.description || ''}
              onChange={(e) => setCurrentTask({...currentTask, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded h-24"
              placeholder="Provide a general summary of the work carried out..."
            ></textarea>
          </div>
          
          {/* Steps */}
          <div className="space-y-4">
            {(currentTask.workSteps || []).map((step, stepIndex) => (
              <div key={step.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Step {stepIndex + 1}</h4>
                  <button
                    onClick={() => removeWorkStep(step.id)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {/* Step description */}
                <textarea
                  value={step.description || ''}
                  onChange={(e) => updateWorkStep(step.id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded h-20 mb-3 bg-white"
                  placeholder={`Describe step ${stepIndex + 1}...`}
                ></textarea>
                
                {/* Step photos */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Photos for this step:</label>
                    <label className="cursor-pointer bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center hover:bg-blue-200">
                      <Camera size={16} className="mr-1" /> Add Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            addPhotoToWorkStep(step.id, e.target.files[0]);
                            e.target.value = ''; // Reset so the same file can be selected again
                          }
                        }}
                      />
                    </label>
                  </div>
                  
                  {/* Photo gallery for this step */}
                  {step.photos && step.photos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                      {step.photos.map((photo) => (
                        <div key={photo.id} className="relative border rounded-lg overflow-hidden bg-white">
                          <img 
                            src={photo.url} 
                            alt={`Photo for step ${stepIndex + 1}`}
                            className="w-full h-32 object-contain p-1"
                          />
                          <button
                            onClick={() => removePhotoFromWorkStep(step.id, photo.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                          >
                            <X size={14} />
                          </button>
                          <input
                            type="text"
                            value={photo.caption || ''}
                            onChange={(e) => updateWorkStepPhotoCaption(step.id, photo.id, e.target.value)}
                            className="w-full bg-white text-xs p-1 border-t"
                            placeholder="Add caption..."
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic mb-2 p-2 border border-dashed border-gray-300 rounded text-center">
                      No photos added for this step yet
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Empty state when no steps */}
            {(!currentTask.workSteps || currentTask.workSteps.length === 0) && (
              <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-2">Document your work with steps</p>
                <button
                  onClick={addWorkStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Plus size={16} className="inline mr-1" /> Add First Step
                </button>
              </div>
            )}
            
            {/* Add Step button at the bottom */}
            {(currentTask.workSteps && currentTask.workSteps.length > 0) && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={addWorkStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                >
                  <Plus size={18} className="mr-1" /> Add Another Step
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Two-column layout for mobile-friendly design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PPE and Special Precautions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="font-medium pb-2 border-b border-gray-200 mb-3">PPE & Precautions</h3>
            <textarea
              value={currentTask.ppe || ''}
              onChange={(e) => updatePPE(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded h-24"
              placeholder="List PPE worn and special precautions taken..."
            ></textarea>
          </div>
          
          {/* Technical Data */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="font-medium pb-2 border-b border-gray-200 mb-3">Technical Data</h3>
            <div className="space-y-2">
              {Object.entries(currentTask.technicalData || {}).map(([key, value], index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={key}
                    readOnly
                    className="p-2 border border-gray-300 rounded bg-gray-50"
                  />
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => updateTechnicalData(key, e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Value"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Special Tools */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="font-medium pb-2 border-b border-gray-200 mb-3">Special Tools</h3>
            <textarea
              value={currentTask.specialTools || ''}
              onChange={(e) => updateSpecialTools(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded h-24"
              placeholder="List special tools used including any calibration required..."
            ></textarea>
          </div>
          
          {/* Further Faults */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="font-medium pb-2 border-b border-gray-200 mb-3">Further Faults</h3>
            <textarea
              value={currentTask.furtherFaults || ''}
              onChange={(e) => updateFurtherFaults(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded h-24"
              placeholder="List any additional faults found..."
            ></textarea>
          </div>
        </div>
      </div>
    );
  }
  
  // Helper function to create empty assessment
  function createEmptyAssessment(type) {
    const now = new Date();
    const id = `${type}-${now.getTime()}`;
    
    // Default structure for different assessment types
    let title = '';
    let tasks = [];
    let technicalData = {};
    
    switch(type) {
      case 'MS0102S':
        title = 'Health, Safety and Good Housekeeping';
        tasks = [
          {
            name: 'Task 1: Personal and Vehicle Protection',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            technicalData: {},
            workSteps: [],
            subtasks: [
              {
                description: 'Select and use personal protective equipment',
                isCompleted: false,
                photos: [],
                notes: ''
              },
              {
                description: 'Select and use vehicle protective equipment',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          },
          {
            name: 'Task 2: Housekeeping Practices',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            technicalData: {},
            workSteps: [],
            subtasks: [
              {
                description: 'Select and use cleaning equipment',
                isCompleted: false,
                photos: [],
                notes: ''
              },
              {
                description: 'Use utilities and consumables avoiding waste',
                isCompleted: false,
                photos: [],
                notes: ''
              },
              {
                description: 'Dispose of waste materials properly',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          }
        ];
        break;
      
      case 'MS56.1s':
        title = 'Engine Systems Assessment';
        tasks = [
          {
            name: 'Task 1: Engine Mechanical System',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            workSteps: [],
            technicalData: {
              'Valve clearances': '',
              'Cam securing bolt torque figures': '',
              'Cam cover bolt torque figures': ''
            },
            subtasks: [
              {
                description: 'Remove and refit a camshaft',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          },
          {
            name: 'Task 2: Cooling Systems',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            workSteps: [],
            technicalData: {
              'Coolant Capacity': '',
              'Coolant type': '',
              'Cooling system operating pressure': ''
            },
            subtasks: [
              {
                description: 'Remove and refit radiator',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          },
          {
            name: 'Task 3: Air Supply and Exhaust System',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            workSteps: [],
            technicalData: {
              'Bolt torque figures': ''
            },
            subtasks: [
              {
                description: 'Remove and refit exhaust manifold or section',
                isCompleted: false,
                photos: [],
                notes: ''
              },
              {
                description: 'Remove and refit air filter housing',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          },
          {
            name: 'Task 4: Fuel and Ignition Systems',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            workSteps: [],
            technicalData: {
              'Bolt Torque figures used': '',
              'Fuel system pressure': '',
              'Spark plug gap': '',
              'Spark plug type': '',
              'Spark plug torque': ''
            },
            subtasks: [
              {
                description: 'Remove and refit fuel injectors',
                isCompleted: false,
                photos: [],
                notes: ''
              },
              {
                description: 'Remove and refit spark plugs',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          },
          {
            name: 'Task 5: Lubrication System',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            workSteps: [],
            technicalData: {
              'Oil pump rotor/gear clearance figures': '',
              'Bolt torques': ''
            },
            subtasks: [
              {
                description: 'Remove and refit the oil pump',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          }
        ];
        break;
        
      case 'MS56.2s':
        title = 'Chassis Systems Assessment';
        tasks = [
          {
            name: 'Task 1: Steering System',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            workSteps: [],
            technicalData: {
              'Toe in/Out': '',
              'Torque figures': ''
            },
            subtasks: [
              {
                description: 'Remove and refit a steering arm ball joint',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          },
          {
            name: 'Task 2: Suspension System',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            workSteps: [],
            technicalData: {
              'Bolt torques': '',
              'Spring rating': ''
            },
            subtasks: [
              {
                description: 'Remove and refit front suspension strut',
                isCompleted: false,
                photos: [],
                notes: ''
              },
              {
                description: 'Remove and refit front suspension spring',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          },
          {
            name: 'Task 3: Braking Systems',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            workSteps: [],
            technicalData: {
              'Front brake disc min thickness': '',
              'Max brake disc run-out': '',
              'Brake fluid specification': '',
              'Min legal foot brake efficiency': '',
              'Min legal parking brake efficiency': ''
            },
            subtasks: [
              {
                description: 'Remove and refit brake pads and discs',
                isCompleted: false,
                photos: [],
                notes: ''
              },
              {
                description: 'Remove and refit brake caliper',
                isCompleted: false,
                photos: [],
                notes: ''
              },
              {
                description: 'Bleed all brakes',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          }
        ];
        break;
        
            // Add other assessment types here
      default:
        title = 'New Assessment';
        tasks = [
          {
            name: 'Task 1',
            isCompleted: false,
            description: '',
            ppe: '',
            specialTools: '',
            furtherFaults: '',
            workSteps: [],
            technicalData: {},
            subtasks: [
              {
                description: 'Subtask 1',
                isCompleted: false,
                photos: [],
                notes: ''
              }
            ]
          }
        ];
    }
    
    return {
      id,
      type,
      title,
      dateCreated: now.toISOString(),
      isCompleted: false,
      vehicleDetails: {
        regNo: '',
        year: '',
        make: '',
        model: '',
        engVIN: ''
      },
      tasks
    };
  }