import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import '../Styles/Plans.css';

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const auth = getAuth(); // Get the auth instance
  const userId = auth.currentUser ? auth.currentUser.uid : null; // Get the current user ID
  const database = getDatabase(); // Get the database instance
  const monthlyPrice = 50;
  const yearlyPrice = 500;

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    // Store the selected plan under the user's ID in the "subscription" node of the database
    if (userId) {
      const subscriptionRef = ref(database, `healthify/subscription/${userId}`);
      const amount = plan === 'monthly' ? monthlyPrice : yearlyPrice;
      set(subscriptionRef, {
        userId: userId,
        plan: plan,
        amount: amount
      })
      .then(() => {
        console.log('Selected plan stored in the database successfully.');
      })
      .catch((error) => {
        console.error('Error storing selected plan:', error);
      });
    }
  };

  return (
    <div>
      <h2>Choose Your Subscription Plan</h2>
      <div>
        <input 
          type="radio" 
          id="monthly" 
          name="subscription" 
          value="monthly"
          checked={selectedPlan === 'monthly'}
          onChange={() => handlePlanSelection('monthly')} 
        />
        <label htmlFor="monthly">Monthly Subscription - $50/month</label>
      </div>
      <div>
        <input 
          type="radio" 
          id="yearly" 
          name="subscription" 
          value="yearly" 
          checked={selectedPlan === 'yearly'}
          onChange={() => handlePlanSelection('yearly')} 
        />
        <label htmlFor="yearly">Yearly Subscription - $500/year</label>
      </div>
      {selectedPlan && (
        <Link to={`/payment?plan=${selectedPlan}`}>
          <button>Proceed to Payment</button>
        </Link>
      )}
    </div>
  );
};

export default Plans;
