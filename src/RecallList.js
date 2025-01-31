import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import RecallCard from "./RecallCard";

const RecallList = () => {
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [distributionQuery, setDistributionQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const API_KEY = "6HJwEolb7Ze8Rcltjy4l1S7t59OrfqU3NrZHPf5r";
  const LIMIT = 10;


  const fetchRecalls = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * LIMIT;

      const classificationFilter = classification ? `+AND+classification:"${classification}"` : "";
      const productFilter = searchQuery ? `+AND+product_description:"${searchQuery}"` : "";
      const distributionFilter = distributionQuery ? `+AND+distribution_pattern:"${distributionQuery}"` : "";
      const locationFilter = locationQuery ? `+AND+(city:"${locationQuery}" OR state:"${locationQuery}")` : "";

      const response = await axios.get(
        `https://api.fda.gov/food/enforcement.json?api_key=${API_KEY}&search=distribution_pattern:"nationwide"${classificationFilter}${productFilter}${distributionFilter}${locationFilter}&limit=${LIMIT}&skip=${skip}`
      );

      let sortedRecalls = response.data.results || [];

   
      sortedRecalls.sort((a, b) => {
        const dateA = a.recall_initiation_date ? parseInt(a.recall_initiation_date) : 0;
        const dateB = b.recall_initiation_date ? parseInt(b.recall_initiation_date) : 0;
        return dateB - dateA;
      });

      setRecalls(sortedRecalls);
      setTotalPages(Math.ceil(response.data.meta.results.total / LIMIT)); 
    } catch (error) {
      console.error("Error fetching data:", error);
      setRecalls([]);
      setTotalPages(1);
    }
    setLoading(false);
  }, [page, classification, searchQuery, distributionQuery, locationQuery]);

  useEffect(() => {
    fetchRecalls();
  }, [fetchRecalls]);

  const handleSearch = () => {
    setPage(1);
    fetchRecalls();
  };


  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

 
  const renderPagination = () => {
    if (totalPages <= 1) return null; 

    const paginationButtons = [];

    paginationButtons.push(
      <button
        key={1}
        onClick={() => handlePageClick(1)}
        className={page === 1 ? "active" : ""}
      >
        1
      </button>
    );

    if (page > 4) {
      paginationButtons.push(<span key="ellipsis-start">...</span>);
    }

    for (let i = Math.max(2, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) {
      paginationButtons.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={page === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    if (page < totalPages - 3) {
      paginationButtons.push(<span key="ellipsis-end">...</span>);
    }

    paginationButtons.push(
      <button
        key={totalPages}
        onClick={() => handlePageClick(totalPages)}
        className={page === totalPages ? "active" : ""}
      >
        {totalPages}
      </button>
    );

    return paginationButtons;
  };

  return (
    <div className="dashboard-container">
      <h2>Food Recall Dashboard</h2>

      {}
      <div className="search-bar">
        <label htmlFor="product-search">Search by Product Description:</label>
        <input
          id="product-search"
          type="text"
          placeholder="Enter product description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {}
      <div className="search-bar">
        <label htmlFor="distribution-search">Search by Distribution:</label>
        <input
          id="distribution-search"
          type="text"
          placeholder="Enter distribution pattern"
          value={distributionQuery}
          onChange={(e) => setDistributionQuery(e.target.value)}
        />
      </div>

      {}
      <div className="search-bar">
        <label htmlFor="location-search">Search by Location:</label>
        <input
          id="location-search"
          type="text"
          placeholder="Enter city or state"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
        />
      </div>

      {}
      <div className="filter-container">
        <label htmlFor="classification-filter">Filter by Classification:</label>
        <select
          id="classification-filter"
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
        >
          <option value="">All</option>
          <option value="Class I">Class I</option>
          <option value="Class II">Class II</option>
          <option value="Class III">Class III</option>
        </select>
      </div>

      {}
      <div className="search-button-container">
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : recalls.length === 0 ? (
        <p>No recalls found.</p>
      ) : (
        recalls.map((recall, index) => <RecallCard key={index} recall={recall} />)
      )}

      {}
      <div className="pagination">{renderPagination()}</div>
    </div>
  );
};

export default RecallList;
