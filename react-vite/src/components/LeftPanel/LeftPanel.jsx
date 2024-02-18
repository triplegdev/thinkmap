const LeftPanel = ({ onSelectShape }) => {
    const handleClick = (shape) => {
        onSelectShape(shape);
    };

    return (
        <div className="leftpanel">
            <button onClick={() => handleClick('circle')}>Circle</button>
            <button onClick={() => handleClick('square')}>Diamond</button>
            <button onClick={() => handleClick('square')}>Square</button>
            <button onClick={() => handleClick('square')}>Parellelogram</button>
        </div>
    );
};

export default LeftPanel;
