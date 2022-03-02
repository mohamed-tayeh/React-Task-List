import PropTypes from 'prop-types';
import Button from './Button';
import { useLocation } from 'react-router-dom';

const Header = ({ title, showTaskForm, showAddTask }) => {
  const location = useLocation();

  return (
    <header className='header'>
      <h1>{title}</h1>
      {
        location.pathname === '/' && 
        <Button color={showAddTask ? 'red' : 'green'} text={showAddTask ? 'Close' : 'Add'} onClick={showTaskForm}/>
      }      
    </header>
  );
};

Header.defaultProps = {
  title: 'Title Tracker',
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;