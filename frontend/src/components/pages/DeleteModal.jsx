import { useModal } from '../../context/Modal';
import './pages.css';

function DeleteModal({ header, body, action }) {
  const { closeModal } = useModal();

  return (
    <>
      <h2>{header}</h2>
      <h4>{body}</h4>
      <div>
        <button onClick={action} className='modal-theme-button'>Yes</button>
        <button onClick={closeModal} className='modal-button'>No</button>
      </div>
    </>
  );
}

export default DeleteModal;
