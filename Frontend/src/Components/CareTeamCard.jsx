// CareTeamCard.js
import React from 'react';
import "../Styles/Common.css";

const CareTeamCard = () => {
  return (
    <div className="CareTeam-Container">
      <h3 className="text-xl font-bold mb-4">Your care team</h3>
      {/* Add buttons or links for finding doctors */}
      <button className="text-blue-600 hover:text-blue-700">
        Find a primary care doctor
      </button>
      
    </div>
  );
};

export default CareTeamCard;
