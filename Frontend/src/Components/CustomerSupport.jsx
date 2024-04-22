import React, { useState } from 'react';
import { getDatabase, ref, set,push } from 'firebase/database';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import '../Styles/Common.css';


const CustomerSupport = () => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentDate = new Date().toISOString();
    const db = getDatabase();
    const ticketsRef = ref(db, `healthify/tickets`);
  
    try {
        const newTicketRef = push(ticketsRef);
        await set(newTicketRef, {
          id: newTicketRef.key, 
          selectedIssue,
          email,
          subject,
          description,
          priority,
          date: currentDate 
        });

    //     // Send custom email confirmation
    //   await sendConfirmationEmail(email);

        setSelectedIssue('');
        setEmail('');
        setSubject('');
        setDescription('');
        setPriority('');
        alert('Ticket generated successfully!');
    
        // setMessage('Ticket generated successfully and a confirmation mail is sent to your email.');
        // setError('');
      } catch (error) {
        // setError('Failed to send ticket confirmation email. Please check the email provided and try again.');
        // setMessage('');
      }
    
  };
  
//   const sendConfirmationEmail = async (recipientEmail) => {
//      };


  return (
    
    <div className="home-section">
    <Navbar />
    <div className="customerSupport">
      <h2>Customer Support</h2>
      <h3>Please let us know why you are reaching out</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="issue"><span className="required">*</span>Select Issue:</label>
          <select id="issue" value={selectedIssue} onChange={(e) => setSelectedIssue(e.target.value)} required>
            <option value="">Select...</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing Issue</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="email"><span className="required">*</span>Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="subject"><span className="required">*</span>Ticket Subject:</label>
          <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="description"><span className="required">*</span>Ticket Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="priority"><span className="required">*</span>Priority:</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} required>
            <option value="">Select...</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
      <Footer />
    </div>
  );
};

export default CustomerSupport;
