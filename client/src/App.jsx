import axios from "axios";
import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  const getAllUsers = () => {
    axios.get("http://localhost:8000/users")
      .then((res) => {
        setUsers(res.data.users);
        setFilterUsers(res.data.users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Search function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchText) || 
      user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };

  // Delete user function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      await axios.delete(`http://localhost:8000/users/${id}`)
        .then(() => {
          const updatedUsers = users.filter((user) => user.id !== id);
          setUsers(updatedUsers);
          setFilterUsers(updatedUsers);
        })
        .catch((error) => {
          console.error("Error deleting the user:", error);
        });
    }
  };

  // Add or update user details
  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      // Update user
      await axios.patch(`http://localhost:8000/users/${userData.id}`, userData)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    } else {
      // Add new user
      await axios.post("http://localhost:8000/users", userData)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error("Error adding user:", error);
        });
    }
    closeModal();
    setUserData({ name: "", age: "", city: "" });
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    getAllUsers();
  };

  // Update user function
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className='container'>
        <h3>CRUD Application with React.js and Node.js</h3>
        <div className="input-search">
          <input type="search" placeholder="Search text here" onChange={handleSearchChange} />
          <button className='btn green' onClick={handleAddRecord}>Add Record</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterusers.map((arr, index) => (
              <tr key={arr.id}>
                <td>{index + 1}</td>
                <td>{arr.name}</td>
                <td>{arr.age}</td>
                <td>{arr.city}</td>
                <td>
                  <button className='btn green' onClick={() => handleUpdateRecord(arr)}>Edit</button>
                </td>
                <td>
                  <button className='btn red' onClick={() => handleDelete(arr.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-contact">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{userData.id ? "update record": "add record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" value={userData.name} name="name" id="name" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input type="number" value={userData.age} name="age" id="age" onChange={handleData} />
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input type="text" value={userData.city} name="city" id="city" onChange={handleData} />
              </div>
              <button className='btn green' onClick={handleSubmit}>{userData.id ? "update user" : "add user"}</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
