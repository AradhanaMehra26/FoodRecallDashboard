import React, { useEffect, useState } from "react";
import axios from "axios";
import RecallCard from "./RecallCard";

const RecallList = () => {
  const [recalls, setRecalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classification, setClassification] = useState(""); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [distributionQuery, setDistributionQuery] = useState(""); 
  const [locationQuery, setLocationQuery] = useState(""); 
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 

  useEffect(() => {
    fetchRecalls();
  }, [page]); 

  const fetchRecalls = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/recalls", {
        params: {
          classification,
          search: searchQuery,
          distribution: distributionQuery,
          location: locationQuery,
          page,
        },
      });

      setRecalls(response.data || []);
      setTotalPages(Math.ceil(response.data.length / 10)); 
    } catch (error) {
      console.error("Error fetching recalls:", error);
      setRecalls([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Food Recall Dashboard</h2>

      {/* Search Inputs */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Product Description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Distribution"
          value={distributionQuery}
          onChange={(e) => setDistributionQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Location (City/State)"
          value={locationQuery}
          onChange={(e) => setLocationQuery(e.target.value)}
        />
        <button onClick={fetchRecalls}>Search</button>
      </div>

      {/* Recall Cards */}
      {loading ? <p>Loading...</p> : recalls.map((recall, index) => <RecallCard key={index} recall={recall} />)}

      {/* Pagination */}
      <div className="pagination">
        {page > 1 && <button onClick={() => setPage(page - 1)}>Previous</button>}
        <button className={page === 1 ? "active" : ""} onClick={() => setPage(1)}>1</button>
        {page < totalPages && <button onClick={() => setPage(page + 1)}>Next</button>}
      </div>
    </div>
  );
};

export default RecallList;
