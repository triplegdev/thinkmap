import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { thunkLogout } from "../../redux/session";
import { editFlowchart } from "../../redux/flowcharts";
import './LeftPanel.css';


const LeftPanel = ({ onSelectShape, flowchart, user, title, onCreate }) => {
    const dispatch = useDispatch();
    const [localTitle, setLocalTitle] = useState('');

    useEffect(() => {
        setLocalTitle(title);
    }, [title]);

    const handleSubmit = e => {
        e.preventDefault();

        const payload = { title: localTitle }

        dispatch(editFlowchart(payload, flowchart.id));
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
                    value={localTitle}
                    onChange={e => setLocalTitle(e.target.value)}
                />
            </form>
            <button onClick={onCreate}>+</button>
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
