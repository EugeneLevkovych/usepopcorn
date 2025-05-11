import NavBar from "./components/NavBar";
import Main from "./components/Main";

import NumResults from "./components/NumResults";
import Search from "./components/Search";

import Box from "./components/Box";
import MovieList from "./components/MovieList";

import WatchedSumary from "./components/WatchedSumary";
import WatchedMoviesList from "./components/WatchedMoviesList";

import { useState } from "react";
import { useEffect } from "react";

import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";

import MovieDetails from "./components/MovieDetails";


const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];


const KEY = '23a6d9cb';

export default function App() {
  const [query, setQuery] = useState("");

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId(selectedId => id === selectedId ? null : id);
  }

  function handleCloseMovie(i) {
    setSelectedId(null);
  }

useEffect(function () {
  async function fetchMovies() {
   try{
    setIsLoading(true);
    setError("")
    
    const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`);

    if(!res.ok) throw new Error("Something went wrong with fetching movies");

      const data = await res.json();

      if(data.Response === "False") throw new Error("Movie not found");

      console.log(data.Response);

      setMovies(data.Search);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
  } 
  
  if(query.length < 3) {
    setMovies([]);
    setError("");
    return;
  }

  fetchMovies();
},[query])

   

  return (
    <>
     <NavBar>
        <Search query={query} setQuery={setQuery}/>
        <NumResults movies={movies} />
     </NavBar> 
      <Main>
          <Box>
            {isLoading && <Loader />}
            {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
            {error && <ErrorMessage message={error} /> }
          </Box> 
          <Box>
             {
             selectedId ? <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie} /> : <><WatchedSumary watched={watched} />
             <WatchedMoviesList watched={watched}/></>}
          </Box>
      </Main> 
    </>
  );
}

 //mini 12 151