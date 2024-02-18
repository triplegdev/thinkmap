import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { TbMail } from "react-icons/tb";
import { TbLock } from "react-icons/tb";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
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
      <form className="login__form" onSubmit={handleSubmit}>
        <h1 id="login">Login</h1>
        <label>
          Email
          <div className="login__icon-input">
            <TbMail/>
            <input
              className="login__input"
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
          Password
          <div className="login__icon-input">
            <TbLock/>
            <input
              className="login__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Password"
            />
          </div>
        </label>
        {errors.password && <p>{errors.password}</p>}
        <button type="submit">Log In</button>
        <div className="login__signup">
          <div>Don&apos;t have an account?</div>
          <div>
            Register
            <OpenModalMenuItem
              itemText="Here"
              modalComponent={<SignupFormModal />}
              itemClass="login__signup-link"
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
