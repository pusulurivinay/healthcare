import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push , set} from 'firebase/database';
import '../Styles/Payments.css';

const Payment = ({ plan, userId }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    zipCode: '',
    paymentMethod: 'debit', // Default payment method
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const database = getDatabase(); // Get the database instance

  // Calculate total amount when the component mounts or the plan changes
  useEffect(() => {
    const calculateTotalAmount = () => {
      const monthlyPrice = 50;
      const yearlyPrice = 500;
      const planPrice = plan === 'monthly' ? monthlyPrice : yearlyPrice;
      const taxRate = 0.1; // 10% tax rate, adjust as needed
      const tax = planPrice * taxRate;
      const totalPrice = planPrice + tax;
      setTotalAmount(totalPrice);
    };
    calculateTotalAmount();
  }, [plan]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userId) {
      console.error('User ID is not available.');
      return;
    }
  
    // Generate a unique payment ID
    const paymentId = Date.now().toString(); // You can use a better way to generate IDs
    const timestamp = Date.now();
  
    // Construct the payment data object
    const paymentData = {
      userId: userId,
      plan: plan,
      totalAmount: totalAmount,
      paymentDetails: {
        cardHolderName: paymentDetails.cardHolderName,
        cardNumber: paymentDetails.cardNumber,
        cvv: paymentDetails.cvv,
        expiryDate: paymentDetails.expiryDate,
        paymentMethod: paymentDetails.paymentMethod,
        zipCode: paymentDetails.zipCode
      },
      timestamp: timestamp
    };
  
    // Store payment details in the database under the payment ID
    const paymentRef = ref(database, `healthify/payments/${paymentId}`);
    set(paymentRef, paymentData)
      .then(() => {
        console.log('Payment details stored in the database successfully.');
        // Redirect to payment details page
        window.location.href = `/payment-details/${paymentId}`; // Redirect to payment details page with payment ID
      })
      .catch((error) => {
        console.error('Error storing payment details:', error);
      });
  };

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      <p>Total Amount: ${totalAmount}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="paymentMethod">Select Payment Method:</label>
        <select 
          id="paymentMethod" 
          name="paymentMethod" 
          value={paymentDetails.paymentMethod} 
          onChange={handleInputChange} 
          required 
        >
          <option value="debit">Debit Card</option>
          <option value="credit">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
        <label htmlFor="cardNumber">Card Number:</label>
        <input 
          type="text" 
          id="cardNumber" 
          name="cardNumber" 
          value={paymentDetails.cardNumber} 
          onChange={handleInputChange} 
          required 
        />
        <label htmlFor="cardHolderName">Card Holder Name:</label>
        <input 
          type="text" 
          id="cardHolderName" 
          name="cardHolderName" 
          value={paymentDetails.cardHolderName} 
          onChange={handleInputChange} 
          required 
        />
        <label htmlFor="expiryDate">Expiry Date:</label>
        <input 
          type="text" 
          id="expiryDate" 
          name="expiryDate" 
          value={paymentDetails.expiryDate} 
          onChange={handleInputChange} 
          required 
        />
        <label htmlFor="cvv">CVV:</label>
        <input 
          type="text" 
          id="cvv" 
          name="cvv" 
          value={paymentDetails.cvv} 
          onChange={handleInputChange} 
          required 
        />
        <label htmlFor="zipCode">Zip Code:</label>
        <input 
          type="text" 
          id="zipCode" 
          name="zipCode" 
          value={paymentDetails.zipCode} 
          onChange={handleInputChange} 
          required 
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
