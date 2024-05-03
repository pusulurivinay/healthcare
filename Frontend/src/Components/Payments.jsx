import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get } from 'firebase/database';
import '../Styles/Payments.css';

const Payment = ({ userId }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    zipCode: '',
    paymentMethod: 'debit',
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const database = getDatabase();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const subscriptionRef = ref(database, `healthify/subscription/${userId}`);
        const snapshot = await get(subscriptionRef);
        if (snapshot.exists()) {
          const subscriptionData = snapshot.val();
          const plan = subscriptionData.plan;
          const monthlyPrice = 80;
          const yearlyPrice = 800;
          const planPrice = plan === 'monthly' ? monthlyPrice : yearlyPrice;
          const taxRate = 0.1;
          const tax = planPrice * taxRate;
          const totalPrice = planPrice + tax;
          setTotalAmount(totalPrice);
        } else {
          console.log('No subscribed plan found for the user.');
        }
      } catch (error) {
        console.error('Error retrieving subscribed plan:', error);
      }
    };

    if (userId) {
      fetchPlan();
    }
  }, [userId, database]);

  const validateInput = () => {
    let isValid = true;
    let newErrors = {};

    // Card number validation: must be 16 digits and numeric
    if (!/^\d{16}$/.test(paymentDetails.cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits.';
      isValid = false;
    }

    // Expiry date validation: must be in MM/YY format and not in past
    if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(paymentDetails.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format.';
      isValid = false;
    }

    // CVV validation: must be 3 or 4 digits
    if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits.';
      isValid = false;
    }

    // Zip code validation: simple numeric check
    if (!/^\d{5,6}$/.test(paymentDetails.zipCode)) {
      newErrors.zipCode = 'Zip code must be 5 or 6 digits.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
    // Clear errors as the user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!userId) {
      console.error('User ID is not available.');
      return;
    }

    if (!validateInput()) {
      console.error('Validation failed. Please check your input.');
      return;
    }

    const paymentId = Date.now().toString();
    const timestamp = Date.now();

    const paymentData = {
      userId: userId,
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

    const paymentRef = ref(database, `healthify/payments/${paymentId}`);
    set(paymentRef, paymentData)
      .then(() => {
        console.log('Payment details stored in the database successfully.');
        // Redirect to payment details page
        window.location.href = `/payment-details/${paymentId}`;
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
        </select>
        <label htmlFor="cardNumber">Card Number:</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={paymentDetails.cardNumber}
          onChange={handleInputChange}
          required
          className={errors.cardNumber ? 'error' : ''}
        />
        {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
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
          className={errors.expiryDate ? 'error' : ''}
        />
        {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
        <label htmlFor="cvv">CVV:</label>
        <input
          type="text"
          id="cvv"
          name="cvv"
          value={paymentDetails.cvv}
          onChange={handleInputChange}
          required
          className={errors.cvv ? 'error' : ''}
        />
        {errors.cvv && <p className="error-message">{errors.cvv}</p>}
        <label htmlFor="zipCode">Zip Code:</label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          value={paymentDetails.zipCode}
          onChange={handleInputChange}
          required
          className={errors.zipCode ? 'error' : ''}
        />
        {errors.zipCode && <p className="error-message">{errors.zipCode}</p>}
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
