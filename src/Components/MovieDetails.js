import { useEffect, useState } from "react";
import Loader from "./Loader";
import StarRating from "./StarRating";

const KEY = "96793eb7";
// const KEY = "6f5e732d";

export default function MovieDetails({
  selectedId,
  closeMovieDetails,
  onAddToWatchedList,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title: movie.Title,
      poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ").at(0)),
      userRating,
    };

    onAddToWatchedList(newMovie);
    closeMovieDetails();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }

      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!movie?.Title) return;
      document.title = `MOVIE | ${movie.Title}`;

      return function () {
        document.title = "Film Nook";
      };
    },
    [movie.Title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={closeMovieDetails}>
              &larr;
            </button>
            <img src={movie.Poster} alt={movie.title} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating maxRating={10} setUserRating={setUserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to Watched List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You have already rated this movie with {watchedUserRating}
                  <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>
              Starring {movie.Actors} Directed by {movie.Director}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
