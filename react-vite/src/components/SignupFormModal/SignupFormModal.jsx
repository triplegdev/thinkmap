import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import { TbUser } from "react-icons/tb";
import { TbMail } from "react-icons/tb";
import { TbLock } from "react-icons/tb";
import { TbLockCheck } from "react-icons/tb";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <>
      {errors.server && <p>{errors.server}</p>}
      <form className="signup__form" onSubmit={handleSubmit}>
				<h1 id="signup">Register</h1>
        <label>
					Email
					<div className="signup__icon-input">
						<TbMail/>
						<input
							className="signup__input"
							type="text"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							placeholder="Enter Email"
						/>
					</div>
				</label>
        {errors.email && <p>{errors.email}</p>}
        <label>
					Username
					<div className="signup__icon-input">
						<TbUser/>
						<input
							className="signup__input"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							placeholder="Enter Username"
						/>
					</div>
				</label>
        {errors.username && <p>{errors.username}</p>}
        <label>
					Password
					<div className="signup__icon-input">
						<TbLock/>
						<input
							className="signup__input"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							placeholder="Enter Password"
						/>
					</div>
				</label>
        {errors.password && <p>{errors.password}</p>}
        <label>
					Confirm Password
					<div className="signup__icon-input">
						<TbLockCheck/>
						<input
							className="signup__input"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							placeholder="Re-enter Password"
						/>
					</div>
				</label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit">Sign Up</button>
        <div className="signup__signup">
          <div>Already have an account?</div>
          <div>
            Log in
            <OpenModalMenuItem
              itemText="Here"
              modalComponent={<LoginFormModal />}
              itemClass="signup__signup-link"
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default SignupFormModal;
