import { useSelector } from "react-redux";
import LandingPage from "../LandingPage";
import MainPage from "../MainPage/MainPage";

const LoginCheck = () => {
    const user = useSelector((store) => store.session.user);

    return user ? <MainPage/> : <LandingPage/>
}

export default LoginCheck;
