export default function Search({ query, setQuery, closeMovieDetails }) {
  function onSetQuery(q) {
    if (q === "") {
      closeMovieDetails();
      setQuery(q);
    } else setQuery(q);
  }

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSetQuery(e.target.value)}
    />
  );
}
