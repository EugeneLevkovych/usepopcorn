import Movie from "./Moovie";
 

export default function MovieList({movies}) { 

    return (<ul className="list">
        {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} />
        ))}
      </ul>)
}