import React, {useState, useEffect} from 'react'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

function HomePage() {

  const [notes, setNotes] = useState([]);

  const {logoutUser} = useContext(AuthContext)
  const {authTokens} = useContext(AuthContext)

  console.log("totens : ", notes)

  useEffect(() => {
    getNotes();
  }, [])

  const getNotes = () => {
    fetch("http://127.0.0.1:8000/api/notes/", {
      method:"GET",
      headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer ' + String(authTokens.access)
      }
  }).then((response) => {
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the response body as JSON
    })
    .then((data) => {
      setNotes(data);
      console.log('API Response notes:', data); // Access the JSON data
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <div>
        <p>You are logged into the home page</p>

        <p>User Notes</p>

        <ul>
          {
            notes && notes.map((note) => (
              <li key={note.id}>{note.body}</li>
            ))
          }
        </ul>

        <button onClick={logoutUser} >Logout</button>
    </div>
  )
}

export default HomePage