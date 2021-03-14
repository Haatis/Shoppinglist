import './App.css';
import {useState, useEffect} from "react";

const URL = "http://localhost/shoppingList/";
function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    let status = 0;
    fetch(URL + "retrieve.php")
    .then(response => {
      status = parseInt(response.status);
      return response.json();
    })
    .then(
      (response) => {
        if (status === 200){
        setTasks(response);
        } else  {
          alert(response.error);
        }
      }, (error) => {
        alert("Häiriö järjestelmässä, yritä kohta uudelleen!");
      }
    )
      }, [])

      function save(e) {
        e.preventDefault();
        let status= 0;
        fetch(URL + "create.php", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            description: task
          })
        })
        .then(response => {
          status = parseInt(response.status);
          return response.json()
        })
        .then(
      (response) => {
        if (status === 200){
        setTasks(tasks => [...tasks,response]);
        setTask("");
        } else  {
          alert(response.error);
        }
      }, (error) => {
        alert("häiriö systeemissä");
      }
    )
      }

      function remove(id) {
        let status = 0;
        fetch(URL + "delete.php", {
          method: "POST",
          headers: {
            "Accept": "applications/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            id: id
          })
        })
        .then(response => {
          status = parseInt(response.status);
          return response.json();
        })
        .then(
          (response) => {
            if (status === 200) {
              const newListWithoutRemoved = tasks.filter((item) => item.id !== id);
              setTasks(newListWithoutRemoved);
            } else {
              alert(response.error);
            }
          }, (error) => {
            alert(error);
          }
        )
      }

  return (
    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={save}>
        <label>New item</label><br></br>
        <label>Description</label> <input value={task.description} onChange={e => setTask(e.target.value)} />
        <br></br>
        <label>Amount</label> <input value={task.amount} onChange={e => setTask(e.target.value)} />
        <button>Save</button>
      </form>
      <ol>
        {tasks.map(task => (
          <li key={task.id}>{task.description}{task.amount}<a className="delete" onClick={() => remove(task.id)} href="#">Delete</a></li>
        ))}
      </ol>

    </div>
  );
}

export default App;
