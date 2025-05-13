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

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
    

  useEffect(function () {
  const controller = new AbortController();

  async function fetchMovies() {
   try{
    setIsLoading(true);
    setError("")
    
    const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{ signal: controller.signal });

    if(!res.ok) throw new Error("Something went wrong with fetching movies");

      const data = await res.json();

      if(data.Response === "False") throw new Error("Movie not found");

      setMovies(data.Search);
      setError("");
        } catch (err) {
          if(err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }  
        } finally {
          setIsLoading(false);
        }
  } 
  
  if(query.length < 3) {
    setMovies([]);
    setError("");
    return;
  }

  handleCloseMovie();
  fetchMovies();

  return function() {
    controller.abort();
  };
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
             selectedId ? <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
              /> : <><WatchedSumary watched={watched} />
             <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} /></>}
          </Box>
      </Main> 
    </>
  );
}

 //mini 12 157