import React from 'react';
import "./Header.css";
import PersonIcon from '@material-ui/icons/Person';
import IconButton from '@material-ui/core/IconButton';
import ForumIcon from '@material-ui/icons/Forum';


function Header() {
    return (
        <div className='header'>
            <IconButton>
                <PersonIcon fontSize="large" className="header__icon"  />
            </IconButton>
            
            <IconButton>
            <img
                className="header__logo"
                src="https://toppng.com/uploads/preview/tinder-logo-transparent-11563247829tbb8yoy9a1.png"
                alt=""/>
            </IconButton>

            <IconButton>
            <ForumIcon fontSize="large" className="header__icon" />
            </IconButton>
            
        </div>
    )
}

export default Header
