import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {
  const [activities,setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity]=useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(()=>{
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response=>{
      console.log(response);
      setActivities(response.data);
    })
  },[])

  function handleSelectActivity(id:string)
  {
    setSelectedActivity(activities.find(x=>x.id===id))
  }

  function handleCancelActivity()
  {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string)
  {
    id ? handleSelectActivity(id) : handleCancelActivity();
    setEditMode(true);
  }

  function handlFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity:Activity)
  {
    activity.id ?
    setActivities([...activities.filter(x=>x.id !== activity.id),activity])
    : setActivities([...activities, {...activity,id:uuid()}]);
    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id:string)
  {
    setActivities([...activities.filter(x=> x.id !== id)])
  }

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop:'7em'}}>
       <ActivityDashboard 
        activities={activities}
        selectedActivity={selectedActivity}
        selectActivity={handleSelectActivity}
        cancleSelectActivity={handleCancelActivity}
        editMode={editMode}
        openForm={handleFormOpen}
        closeForm={handlFormClose}
        createOrEdit={handleCreateOrEditActivity}
        deleteActivity={handleDeleteActivity}
       />
      </Container>
      
      </>
  );
}

export default App;