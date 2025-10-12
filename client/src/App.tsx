import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("api/users");
        const json = await res.json();
        setUsers(json);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2> <br /> <h2>{user.lastName}</h2>
        </div>
      ))}
    </div>
  );
}

export default App;
