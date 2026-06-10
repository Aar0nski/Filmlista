import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch("https://localhost:7232/api/Movies")
            .then((res) => res.json())
            .then((data) => setMovies(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h1>Filmlista</h1>

            {movies.map((movie) => (
                <div key={movie.id}>
                    <h2>{movie.title}</h2>
                    <p>{movie.description}</p>
                    <p>År: {movie.releaseYear}</p>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default App;