import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [releaseYear, setReleaseYear] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(localStorage.getItem("role"));

    useEffect(() => {
        loadMovies();
    }, []);

    function loadMovies() {
        fetch("https://localhost:7232/api/Movies")
            .then((res) => res.json())
            .then((data) => setMovies(data))
            .catch((err) => console.error(err));
    }

    function login(e) {
        e.preventDefault();

        fetch("https://localhost:7232/api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => {
                if (!res.ok) {
                    alert("Fel användarnamn eller lösenord");
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (!data) return;

                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);
                setRole(data.role);

                setUsername("");
                setPassword("");

                alert("Inloggad som " + data.role);
            });
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setRole(null);
    }

    function addMovie(e) {
        e.preventDefault();

        fetch("https://localhost:7232/api/Movies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
                releaseYear: Number(releaseYear),
                categoryId: 1,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                setTitle("");
                setDescription("");
                setReleaseYear("");
                loadMovies();
            });
    }

    function deleteMovie(id) {
        const token = localStorage.getItem("token");

        fetch(`https://localhost:7232/api/Movies/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.status === 401) {
                alert("Du måste vara inloggad.");
                return;
            }

            if (res.status === 403) {
                alert("Endast Admin får ta bort filmer.");
                return;
            }

            loadMovies();
        });
    }

    return (
        <div className="app">
            <h1>Filmlista</h1>

            {!role ? (
                <form onSubmit={login} className="login-form">
                    <h2>Logga in</h2>

                    <input
                        placeholder="Användarnamn"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Lösenord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">Logga in</button>

                    <p>Admin: admin / password</p>
                    <p>User: user / password</p>
                </form>
            ) : (
                <div>
                    <p>Inloggad som: {role}</p>
                    <button onClick={logout}>Logga ut</button>
                </div>
            )}

            <form onSubmit={addMovie} className="movie-form">
                <input
                    placeholder="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    placeholder="Beskrivning"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    placeholder="År"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                />

                <button type="submit">Lägg till film</button>
            </form>

            <div className="movie-list">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <h2>{movie.title}</h2>
                        <p>{movie.description}</p>
                        <p>År: {movie.releaseYear}</p>

                        {role === "Admin" && (
                            <button
                                className="delete-button"
                                onClick={() => deleteMovie(movie.id)}
                            >
                                Ta bort
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;