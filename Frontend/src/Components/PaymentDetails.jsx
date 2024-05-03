import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import '../Styles/PaymentDetails.css';
import { getAuth } from 'firebase/auth';
import jsPDF from 'jspdf';

const PaymentDetails = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(null);
  const { paymentId } = useParams();
  const database = getDatabase();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const paymentRef = ref(database, `healthify/payments/${paymentId}`);
        const snapshot = await get(paymentRef);

        if (snapshot.exists()) {
          const paymentData = snapshot.val();
          setPaymentDetails(paymentData);

          const auth = getAuth();
          const userId = auth.currentUser ? auth.currentUser.uid : null;
          if (userId) {
            const userRef = ref(database, `healthify/users/${userId}`);
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
    const lastFourDigits = cardNumber.slice(-4);
    return `**** **** **** ${lastFourDigits}`;
  };

  const formatPaymentTime = (timestamp) => {
    const paymentTime = new Date(timestamp).toLocaleString();
    return `Payment Time: ${paymentTime}`;
  };

  const handleExportDetails = () => {
    if (!paymentDetails) {
      console.error('Payment details are not available.');
      return;
    }

    const doc = new jsPDF();
    doc.text(`Username: ${userName}`, 10, 10);
    doc.text(`Plan: ${paymentDetails.plan}`, 10, 20);
    doc.text(`Amount: ${paymentDetails.totalAmount}`, 10, 30);
    doc.text(`Payment Method: ${paymentDetails.paymentDetails.paymentMethod}`, 10, 40);
    doc.text(`Card Number: ${formatCardNumber(paymentDetails.paymentDetails.cardNumber)}`, 10, 50);
    doc.text(`Card Holder Name: ${paymentDetails.paymentDetails.cardHolderName}`, 10, 60);
    doc.text(`Zip Code: ${paymentDetails.paymentDetails.zipCode}`, 10, 70);
    doc.text(`${paymentDetails.timestamp ? formatPaymentTime(paymentDetails.timestamp) : 'Unknown'}`, 10, 80);

    doc.save(`payment_details_${paymentId}.pdf`);
  };

  return (
    <div className="payment-details-container">
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
          <button className="export-button" onClick={handleExportDetails}>
            Export Details as PDF
          </button>
          <a href="/user-dashboard"><button>Go Back</button></a>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
