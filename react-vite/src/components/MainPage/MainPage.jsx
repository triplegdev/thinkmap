// import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";

const MainPage = () => {
    // const user = useSelector((store) => store.session.user);
    const dispatch = useDispatch();
    // const [selectedShape, setSelectedShape] = useState(null);

    // const handleSelectShape = (shape) => {
    //   setSelectedShape(shape);
    // };

    const logout = (e) => {
        e.preventDefault();
        dispatch(thunkLogout());
    };

    return (
        <>
            <h1>Hello from MainPage</h1>
            <button onClick={logout}>Log Out</button>
        </>
    //   <div>
    //     <LeftPanel onSelectShape={handleSelectShape} />
    //     <Grid selectedShape={selectedShape} />
    //   </div>
    );
  };

  export default MainPage;
