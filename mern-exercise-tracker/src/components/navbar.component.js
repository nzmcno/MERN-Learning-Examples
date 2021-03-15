import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand" >ExcerTracker</Link>
                <div className="collpase navbar-collapse" >
                    <ul className="navbar-nav mr-auto" >
                        <li className="nav-item" >
                        <Link to="/" className="nav-link" >Excercises</Link>
                        </li>
                        <li className="nav-item">
                        <Link to="/create" className="nav-link" >Create Excercise Log</Link>
                        </li>
                        <li className="nav-item">
                        <Link to="/user" className="nav-link" >Create User</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}