import { v4 as uuidv4 } from 'uuid'

const KEY = 'pm_full_data_v1'

function defaultData(){
  const p1 = { id: 'p1', name: 'Website Redesign - Acme', description: 'Redesign website and refresh branding', startDate: '2025-08-01', endDate: '2025-09-10' }
  const p2 = { id: 'p2', name: 'Branding - BlueWave', description: 'New brand identity and assets', startDate: '2025-08-05', endDate: '2025-10-01' }
  const tasks = [
    { id: 't1', projectId: 'p1', title: 'Kickoff meeting', startDate: '2025-08-01', dueDate: '2025-08-02', priority: 'medium', status: 'Completed', tags: ['kickoff'], assignedTo: 'Rajkumar', attachments: [], myDay: false, completed: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 't2', projectId: 'p1', title: 'Hero banner design', startDate: '2025-08-03', dueDate: '2025-08-15', priority: 'high', status: 'In Progress', tags: ['design'], assignedTo: 'Aastha', attachments: [], myDay: true, completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 't3', projectId: 'p1', title: 'Content audit', startDate: '2025-08-04', dueDate: '2025-08-09', priority: 'low', status: 'Backlog', tags: ['content'], assignedTo: '', attachments: [], myDay: false, completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 't4', projectId: 'p2', title: 'Logo exploration', startDate: '2025-08-06', dueDate: '2025-08-12', priority: 'high', status: 'Review', tags: ['design','logo'], assignedTo: 'Rajkumar', attachments: [], myDay: false, completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ]
  return { projects: [p1,p2], tasks }
}

export function loadData(){
  const raw = localStorage.getItem(KEY)
  if(!raw) {
    const d = defaultData()
    localStorage.setItem(KEY, JSON.stringify(d))
    return d
  }
  try {
    return JSON.parse(raw)
  } catch(e){
    console.error('parse storage', e)
    const d = defaultData()
    localStorage.setItem(KEY, JSON.stringify(d))
    return d
  }
}

export function saveData(data){
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function addProject(project){
  const data = loadData()
  project.id = project.id || uuidv4()
  data.projects.push(project)
  saveData(data)
  return project
}

export function updateProject(project){
  const data = loadData()
  const idx = data.projects.findIndex(p=>p.id===project.id)
  if(idx!==-1) data.projects[idx] = project
  saveData(data)
}

export function deleteProject(projectId){
  const data = loadData()
  data.projects = data.projects.filter(p=>p.id!==projectId)
  data.tasks = data.tasks.filter(t=>t.projectId!==projectId)
  saveData(data)
}

export function addTask(task){
  const data = loadData()
  task.id = task.id || uuidv4()
  task.createdAt = new Date().toISOString()
  task.updatedAt = new Date().toISOString()
  data.tasks.push(task)
  saveData(data)
  return task
}

export function updateTask(task){
  const data = loadData()
  const idx = data.tasks.findIndex(t=>t.id===task.id)
  if(idx!==-1) data.tasks[idx] = task
  saveData(data)
}

export function deleteTask(taskId){
  const data = loadData()
  data.tasks = data.tasks.filter(t=>t.id!==taskId)
  saveData(data)
}

export function exportJSON(){
  const data = loadData()
  return JSON.stringify(data, null, 2)
}

export function importJSON(json){
  try {
    const parsed = JSON.parse(json)
    if(parsed.projects && parsed.tasks){
      localStorage.setItem(KEY, JSON.stringify(parsed))
      return true
    }
    return false
  } catch(e){
    return false
  }
}
