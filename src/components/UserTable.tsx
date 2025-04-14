import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    city: string;
  };
  phone: string;
  birthdate: string;
  company: {
    name: string;
  };
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [filtered, setFiltered] = useState(false);
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get("https://mocki.io/v1/194e77a9-7f0b-41f3-8607-6bc93e558b74")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(error));
  }, []);

  const getNestedValue = (obj: any, key: string) => {
    return key.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const filteredUsers = filtered
    ? sortedUsers.filter(
        (user) =>
          new Date().getFullYear() - new Date(user.birthdate).getFullYear() > 18
      )
    : sortedUsers;

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (id: number) => {
    setHighlightedRow(id);
  };

  return (
    <div>
      <button onClick={() => requestSort("id")}>Сортировать по ID</button>
      <button onClick={() => requestSort("name")}>Сортировать по имени</button>
      <button onClick={() => requestSort("birthdate")}>
        Сортировать по дате рождения
      </button>
      <label>
        <input
          type="checkbox"
          checked={filtered}
          onChange={() => setFiltered(!filtered)}
        />
        Показать только старше 18 лет
      </label>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Никнейм</th>
            <th>Email</th>
            <th>Город</th>
            <th>Телефон</th>
            <th>Дата рождения</th>
            <th>Компания</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              onClick={() => handleRowClick(user.id)}
              style={{
                backgroundColor:
                  highlightedRow === user.id ? "#c1c1c1" : "transparent",
              }}
            >
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.address.city}</td>
              <td>{user.phone}</td>
              <td>{user.birthdate}</td>
              <td>{user.company.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
