import { useModal } from '../../context/Modal';
import './DeleteFlowchartModal.css';

const DeleteFlowchartModal = ({ onDelete }) => {
    const { closeModal } = useModal();

    const handleDelete = () => {
        onDelete();
        closeModal();
    }

    return (
        <div className="delete-spot">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this flowchart?</p>
            <button className="delete-spot__yes" onClick={handleDelete}>Yes (Delete Flowchart)</button>
            <button className="delete-spot__no" onClick={closeModal}>No (Keep Flowchart)</button>
        </div>
    );
};

export default DeleteFlowchartModal;
