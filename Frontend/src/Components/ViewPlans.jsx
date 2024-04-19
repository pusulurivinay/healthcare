// ViewPlans.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ViewPlans = () => {
  return (
    <div className="container">
      <h2 className="planh2">Available Plans</h2>
      <div className="subscription-options">
        <div className="subscription-option">
          <p>Monthly Subscription - $50/month</p>
        </div>
        <div className="subscription-option">
          <p>Yearly Subscription - $500/year</p>
        </div>
      </div>
      <Link to="/user-dashboard">
        <button>Back to User Dashboard</button>
      </Link>
    </div>
  );
};

export default ViewPlans;
