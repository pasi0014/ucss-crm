import React, { useState, ChangeEvent, FormEvent } from "react";

const RegisterForm = () => {
  const [password, setPassword] = useState<string>('');
  const [checkpassword, setCheckpassword] = useState<string>('');
  const [formError, setFormError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
// pass logic
    if (name === 'password') {
      setPassword(value);
    } else {
      setCheckpassword(value);
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
// pass checker
    if (password === checkpassword) {
      console.log('Form submitted successfully!');
    } else {
      setFormError(true);
      setErrorMessage('Inputs do not match');
    }
  }

  return (
    <div>
      <form action="" method="POST" onSubmit={onSubmit}>
        <p>Register form</p>
        <label htmlFor="emailhold">Email: </label>
        <br></br>
        <input
          type="email"
          name="emails"
          id="emailhold"
          placeholder="Email"
          required
        />
        <br></br>

        <label htmlFor="password">Password: </label>
        <br></br>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={onInputChange}
          placeholder="Password"
          required
        />
        <br></br>

        <label htmlFor="confirmPassword">Confirm password: </label>
        <br></br>
        <input
          type="password"
          name="passwordcheck"
          id="confirmPassword"
          placeholder="Confirm password"
          required
          value={checkpassword}
          onChange={onInputChange}
          
          />
           <p>{errorMessage}</p>
        <br></br>

        <input type="checkbox" name="terms" id="privacy" required />
        <label htmlFor="terms">
          {" "}
          I accept the <a href="#">Terms of Use</a> &{" "}
          <a href="#">Privacy Policy</a>
        </label>
        <br></br>
        {/* disable button when pass != passcheck */}
        <input type="submit" value="Register"  disabled={formError || password !== checkpassword} /> 
      </form>
    </div>
  );
};

export default RegisterForm;
