// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function removeOneCharacter(id) {
    fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 200) {
          const updated = characters.filter((character) => character.id !== id);
          setCharacters(updated);
        } else {
          throw new Error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then(() => setCharacters([...characters, person]))
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error("Failed to add user");
        }
      })
      .then((data) => {
        person.id = data.id; // Update the person object with the ID returned from the server
        return person;
      });

    return promise;
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}
export default MyApp;
