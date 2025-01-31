import React from "react";

const RecallCard = ({ recall }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}/${month}/${day}`;
  };

  return (
    <div className="recall-card">
      <div className="recall-card-content">
        <h3 className="recall-card-title">
          {recall.product_description || "No Product Description"}
        </h3>
        <p className="recall-card-text">
          <strong>Reason for Recall:</strong> {recall.reason_for_recall || "Not Available"}
        </p>
        <p className="recall-card-text">
          <strong>Recall Date:</strong> {formatDate(recall.recall_initiation_date)}
        </p>
        <p className="recall-card-text">
          <strong>Distribution:</strong> {recall.distribution_pattern || "Not Available"}
        </p>
        <p className="recall-card-text">
          <strong>Location:</strong>{" "}
          {recall.city || "City Not Available"}, {recall.state || "State Not Available"}
        </p>
        <p className="recall-card-text">
          <strong>Company:</strong> {recall.recalling_firm || "Not Available"}
        </p>
      </div>
    </div>
  );
};

export default RecallCard;
