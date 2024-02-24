import { useState } from 'react';
import { TbTrash } from "react-icons/tb";
import DeleteFlowchartModal from '../DeleteFlowchartModal/DeleteFlowchartModal';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import './RightPanel.css';

const RightPanel = ({ isVisible, onClose, flowcharts, onDeleteFlowchart, onSelectFlowchart }) => {
    const [hoveredItemId, setHoveredItemId] = useState(null);

    const handleMouseEnter = (flowchart) => {
        setHoveredItemId(flowchart.id);
    };

    const handleMouseLeave = () => {
        setHoveredItemId(null);
    };

    const handleDelete = (flowchartId) => {
        onDeleteFlowchart(flowchartId);
    };

    return (
        <>
        <div className={`rightpanel ${isVisible ? 'visible' : 'hidden'}`}>
            <h2>Flowcharts</h2>
            <ul className="rightpanel__flowcharts">
            {Object.values(flowcharts).map((flowchart) => (
                <li key={flowchart.id} onClick={() => onSelectFlowchart(flowchart)} onMouseEnter={() => handleMouseEnter(flowchart)} onMouseLeave={handleMouseLeave}>
                    {flowchart.title}
                    <OpenModalButton
                        buttonText={<TbTrash />}
                        modalComponent={<DeleteFlowchartModal onDelete={() => handleDelete(flowchart.id)}/>}
                        buttonClass={hoveredItemId === flowchart.id ? 'show' : 'hide'}
                    />
                    {/* <span className={hoveredItemId === flowchart.id ? 'show' : 'hide'} onClick={handleDeleteFlowchart}><TbTrash /></span> */}
                </li>
            ))}
            </ul>
        </div>
        <div className={`rightpanel__arrow ${isVisible ? 'arrow-rotate' : ''}`} onClick={onClose}>
            <span>&#8592;</span>
        </div>
        </>
    )
}

export default RightPanel;
