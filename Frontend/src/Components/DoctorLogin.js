import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../Styles/DoctorLogin.css';
import { Link } from 'react-router-dom';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/(?=.*[0-9])/, 'Password must contain a number.')
    .required('Password is required'),
});

const DoctorLogin = ({ onSwitchToSignup }) => (
  <div className="login-container">
    <h2>Login</h2>
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          console.log('Logging in', values);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" className="field-error" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" className="field-error" />
          </div>

          <button type="submit" disabled={isSubmitting}>
            Login
          </button>
        </Form>
      )}
    </Formik>
    <p>
      Don't have an account? <Link to="/doctor-signup">Create an account</Link>
    </p>
  </div>
);

export default DoctorLogin;