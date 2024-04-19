import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import '../Styles/PaymentDetails.css';

const PaymentDetails = () => {
  const { paymentId } = useParams(); // Get the paymentId from the URL params
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null); // State to store the username
  const database = getDatabase(); // Get the database instance

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const paymentRef = ref(database, `healthify/payments/${paymentId}`);
        const snapshot = await get(paymentRef);
        if (snapshot.exists()) {
          const paymentData = snapshot.val();
          setPaymentDetails(paymentData);
          const userId = paymentData.userId; // Retrieve userId from paymentData
          if (userId) {
            // Fetch user details based on userId
            const userRef = ref(database, `users/${userId}`);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
              setUserName(userSnapshot.val().username);
            } else {
              setUserName('Unknown');
            }
          } else {
            setUserName('Unknown');
          }
        } else {
          setError('No payment details found.');
        }
      } catch (error) {
        console.error('Error retrieving payment details:', error);
        setError('Error retrieving payment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId, database]);

  const formatCardNumber = (cardNumber) => {
    // Extract last 4 digits of the card number
    const lastFourDigits = cardNumber.slice(-4);
    return `**** **** **** ${lastFourDigits}`;
  };

  const formatPaymentTime = (timestamp) => {
    const paymentTime = new Date(timestamp).toLocaleString();
    return `Payment Time: ${paymentTime}`;
  };

  const handleExportDetails = () => {
    // Check if paymentDetails is available
    if (!paymentDetails) {
      console.error('Payment details are not available.');
      return;
    }
  
    // Create a CSV content string
    let csvContent = 'Username,Plan,Amount,Payment Method,Card Number,Card Holder Name,Zip Code,Payment Time\n'; // CSV header
  
    // Add payment details to the CSV content
    csvContent += `${userName},${paymentDetails.plan},${paymentDetails.totalAmount},${paymentDetails.paymentDetails.paymentMethod},`;
    csvContent += `${paymentDetails.paymentDetails.cardNumber},${paymentDetails.paymentDetails.cardHolderName},`;
    csvContent += `${paymentDetails.paymentDetails.zipCode},`;
    csvContent += `${paymentDetails.timestamp ? new Date(paymentDetails.timestamp).toLocaleString() : 'Unknown'}\n`;
  
    // Create a Blob object containing the CSV content
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
  
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(csvBlob);
    downloadLink.download = `payment_details_${paymentId}.csv`;
  
    // Append the download link to the body and trigger the click event to start the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
  
    // Clean up by removing the download link from the DOM
    document.body.removeChild(downloadLink);
  };
  
  return (
    <div>
      <h2>Payment Details</h2>
      {loading && <p>Loading payment details...</p>}
      {error && <p>{error}</p>}
      {paymentDetails && (
        <div>
          <p>Username: {userName}</p>
          <p>Plan: {paymentDetails.plan}</p>
          <p>Amount: ${paymentDetails.totalAmount}</p>
          {paymentDetails.paymentDetails && (
            <>
              <p>Payment Method: {paymentDetails.paymentDetails.paymentMethod}</p>
              <p>Card Number: {formatCardNumber(paymentDetails.paymentDetails.cardNumber)}</p>
              <p>Card Holder Name: {paymentDetails.paymentDetails.cardHolderName}</p>
              <p>Zip Code: {paymentDetails.paymentDetails.zipCode}</p>
            </>
          )}
          <p>{paymentDetails.timestamp && formatPaymentTime(paymentDetails.timestamp)}</p>
          <button onClick={handleExportDetails}>Export Details</button>
          <a href="/user-dashboard"><button>Go Back</button></a>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;

