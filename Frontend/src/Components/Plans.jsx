import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set, query, orderByChild, equalTo }from 'firebase/database';
import '../Styles/Plans.css';

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [subscribedPlan, setSubscribedPlan] = useState(null);
  const [userId, setUserId] = useState(null); // State to store the user ID
  const auth = getAuth(); // Get the auth instance
  const database = getDatabase(); // Get the database instance
  const monthlyPrice = 50;
  const yearlyPrice = 500;

  useEffect(() => {
    // Fetch the user ID asynchronously
    const fetchUserId = async () => {
      if (auth.currentUser) {
        setUserId(auth.currentUser.uid);
      }
    };
  
    fetchUserId();
  }, [auth]);

  // Fetch subscribed plan when the component mounts or user ID changes
  useEffect(() => {
    if (userId) {
      const subscriptionRef = ref(database, `healthify/subscription/${userId}`);
      get(subscriptionRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const subscriptionData = snapshot.val();
            setSubscribedPlan(subscriptionData.plan);
          } else {
            console.log('No subscribed plan found.');
          }
        })
        .catch((error) => {
          console.error('Error retrieving subscribed plan:', error);
        });
    }
  }, [userId, database]);

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    const amount = plan === 'monthly' ? monthlyPrice : yearlyPrice; // Determine the amount based on the selected plan
  
    // Store the selected plan and amount in Firebase
    if (userId) {
      const subscriptionRef = ref(database, `healthify/subscription/${userId}`);
      set(subscriptionRef, { plan: plan, amount: amount }) // Include the amount in the stored data
        .then(() => {
          console.log('Selected plan and amount stored in Firebase successfully.');
        })
        .catch((error) => {
          console.error('Error storing selected plan and amount:', error);
        });
    }
  };

  const handlePaymentInvoices = () => {
    if (userId) {
      const paymentsRef = ref(database, 'healthify/payments');
      const userPaymentsQuery = query(paymentsRef, orderByChild('userId'), equalTo(userId));
  
      get(userPaymentsQuery)
        .then((snapshot) => {
          const paymentIds = [];
          snapshot.forEach((childSnapshot) => {
            paymentIds.push(childSnapshot.key);
          });
  
          // If there are multiple payments, navigate to the first payment details
          if (paymentIds.length > 0) {
            const firstPaymentId = paymentIds[0];
            // Navigate to payment-details route with the first payment ID as query parameter
            window.location.href = `/payment-details/${firstPaymentId}`;
          } else {
            console.log('No payment invoices found.');
          }
        })
        .catch((error) => {
          console.error('Error retrieving payment invoices:', error);
        });
    }
  };

  return (
    <div className="container">
      <h2 className="planh2">Choose Your Subscription Plan</h2>
      {subscribedPlan ? (
        <p>You are currently subscribed to the {subscribedPlan} plan.</p>
      ) : (
        <div className="subscription-options">
          <div className="subscription-option">
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
          <div className="subscription-option">
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
          {userId && selectedPlan && (
            // Plans Component
          <Link to={`/payment?plan=${selectedPlan}&userId=${userId}`}>
            <button>Proceed to Payment</button>
          </Link>

          )}
        </div>
      )}
      <div>
        <Link to="/view-plans">
          <button>View Available Plans</button>
        </Link>
        <Link to="/payment-details">
        <button onClick={handlePaymentInvoices}>Payment Invoices</button>
        </Link>
      </div>
    </div>
  );
};

export default Plans;
