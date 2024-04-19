// CareTeamCard.js
import React from 'react';

const CareTeamCard = () => {
  return (
    <div className="bg-white shadow p-4 rounded-lg mb-4">
      <h3 className="text-xl font-bold mb-4">Your care team</h3>
      {/* Add buttons or links for finding doctors */}
      <button className="text-blue-600 hover:text-blue-700">
        Find a primary care doctor
      </button>
      {/* Repeat for other actions */}
    </div>
  );
};

export default CareTeamCard;
