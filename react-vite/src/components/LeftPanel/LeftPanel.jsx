import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { thunkLogout } from "../../redux/session";
import './LeftPanel.css';


const LeftPanel = ({ onSelectShape, flowchartTitle, user }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(flowchartTitle);

    // useEffect(() => {

    // })

    const handleSubmit = e => {
        e.preventDefault();
    }

    const handleClick = (shape) => {
        onSelectShape(shape);
    };

    const logout = (e) => {
        e.preventDefault();
        dispatch(thunkLogout());
    };

    return (
        <div id="leftpanel">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </form>
            <button onClick={() => handleClick('terminal')}>Terminal</button>
            <button onClick={() => handleClick('decision')}>Decision</button>
            <button onClick={() => handleClick('process')}>Process</button>
            <button onClick={() => handleClick('data')}>Data</button>
            <img id="leftpanel__img" src={user.avatar} alt="" />
            <h2 id="leftpanel__user">{user.username}</h2>
            <Link to="/account">My Account</Link>
            <button onClick={logout}>Log Out</button>
        </div>
    );
};

export default LeftPanel;
