import Spinner from 'react-bootstrap/Spinner';

function Loader() {
  return (
    <Spinner role="status" animation="border" variant="success">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default Loader;