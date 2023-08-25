import { useState, useEffect } from "react";
// import StarRating from "./StarRating";
// import Button from "./Button";
import Box from "./Box";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import Logo from "./Logo";
import Main from "./Main";
// import Movie from "./Movie";
import MovieDetails from "./MovieDetails";
import MoviesList from "./MoviesList";
import NavBar from "./NavBar";
import NumResults from "./NumResults";
import Search from "./Search";
import Summary from "./Summary";
import WatchedList from "./WatchedList";

const KEY = "96793eb7";
// const KEY = "6f5e732d";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSetSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function closeMovieDetails() {
    setSelectedId(null);
  }

  function handleAddToWatchedList(newMovie) {
    setWatched([...watched, newMovie]);
  }

  function handleDeleteWatched(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("Something went wrong!");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      closeMovieDetails();
      fetchMovies();

      return function () {
        setIsLoading(false);
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search
          query={query}
          setQuery={setQuery}
          closeMovieDetails={closeMovieDetails}
        />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectId={handleSetSelectedId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              closeMovieDetails={closeMovieDetails}
              onAddToWatchedList={handleAddToWatchedList}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
