// import { memo } from "react";
// import PropTypes from "prop-types";
// //import "./BlogSearch.css";

// const BlogSearch = memo(function BlogSearch({
//   searchTerm,
//   onSearch,
//   resultCount,
// }) {
//   return (
//     <div className="blog-search">
//       <div className="search-input-wrapper">
//         <input
//           type="search"
//           value={searchTerm}
//           onChange={(e) => onSearch(e.target.value)}
//           placeholder="Search posts..."
//           className="search-input"
//         />
//         {searchTerm && (
//           <span className="search-results-count">
//             {resultCount} results found
//           </span>
//         )}
//       </div>
//     </div>
//   );
// });

// BlogSearch.propTypes = {
//   searchTerm: PropTypes.string.isRequired,
//   onSearch: PropTypes.func.isRequired,
//   resultCount: PropTypes.number.isRequired,
// };

// export default BlogSearch;

import { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import "./BlogSearch.css";
import { debounce } from "lodash";
const BlogSearch = memo(function BlogSearch({
  searchTerm,
  onSearch,
  resultCount,
}) {
  const [recentSearches, setRecentSearches] = useState([]);
  // Debounced function to get recent searches
  const fetchRecentSearches = debounce(() => {
    const savedSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (savedSearches) {
      setRecentSearches(savedSearches);
    }
  }, 500); // 500 ms debounce delay
  // useEffect to fetch recent searches on mount
  useEffect(() => {
    fetchRecentSearches();
    // Cleanup function to cancel debounce if the component unmounts
    return () => fetchRecentSearches.cancel();
  }, []); // Empty dependency array ensures this effect runs only on mount
  // Function to update recent searches in localStorage
  const updateRecentSearches = (newSearch) => {
    let updatedSearches = [...recentSearches];
    // Avoid duplicates
    if (!updatedSearches.includes(newSearch)) {
      updatedSearches.unshift(newSearch); // Add to the start of the array
    }
    // Limit to 5 recent searches
    updatedSearches = updatedSearches.slice(0, 4);
    // Save updated searches to localStorage
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);
  };
  // Handle input change and search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    //onSearch(query);
    // Update recent searches if the query is not empty
    if (query.trim() && !recentSearches.includes(query)) {
        onSearch(query);
      updateRecentSearches(query);
    }
  };
  // Handle selection of a recent search
  const handleRecentSearchClick = (search) => {
    onSearch(search);
  };
  return (
    <div className="blog-search">
      <div className="search-input-wrapper">
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search posts..."
          className="search-input"
        />
        {searchTerm && (
          <span className="search-results-count">
            {resultCount} results found
          </span>
        )}
      </div>
      {recentSearches.length > 0 && !searchTerm && (
        <div className="recent-searches">
          <h3>Recent Searches:</h3>
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index} onClick={() => handleRecentSearchClick(search)}>
                {search}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
BlogSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
};
export default BlogSearch;
