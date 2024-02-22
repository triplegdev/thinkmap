import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { thunkLogout } from "../../redux/session";
import { editFlowchart } from "../../redux/flowcharts";
import './LeftPanel.css';


const LeftPanel = ({ /*onSelectShape,*/ flowchart, user, onCreateFlowchart, onCreateSymbol }) => {
    const dispatch = useDispatch();
    const [localTitle, setLocalTitle] = useState(flowchart.title);

    useEffect(() => {
        setLocalTitle(flowchart.title);
    }, [flowchart.title]);

    const handleSubmit = e => {
        e.preventDefault();

        const payload = { title: localTitle }

        dispatch(editFlowchart(payload, flowchart.id));
    }

    const createSymbolClick = type => {
        const symbol = {
            x_position: window.innerWidth / 2,
            y_position: window.innerHeight / 2,
            type,
            text: ''
        }
        onCreateSymbol(symbol);
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
            <button onClick={onCreateFlowchart}>+</button>
            <button onClick={() => createSymbolClick('Terminal')}>Terminal</button>
            <button onClick={() => createSymbolClick('Decision')}>Decision</button>
            <button onClick={() => createSymbolClick('Process')}>Process</button>
            <button onClick={() => createSymbolClick('Data')}>Data</button>
            <img id="leftpanel__img" src={user.avatar} alt="" />
            <h2 id="leftpanel__user">{user.username}</h2>
            <Link to="/account">My Account</Link>
            <button onClick={logout}>Log Out</button>
        </div>
    );
};

export default LeftPanel;
