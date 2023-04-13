import React from "react";
import {Link, useLocation} from "react-router-dom";

function Navbar() {

    const location = useLocation();

    function HandleMobileMenu() {
        const active = "navbar-list-active";
        const button = document.querySelector(".navbar-list");
        if (button!.classList.contains(active)) {
            button!.classList.remove(active);
        }
        else {
            button!.classList.add(active);
        }
    }

    function List() {

        const items = [
            {name: 'Insert', link: '/'},
            {name: 'View', link: '/view'},
            {name: 'Resources', link: '/resources'}
        ];

        return (
            <div id="navbar-list">
                 <ul id={"navbar-list-wrapper"} className={"navbar-list"}>
                    {items.map((item, index) => {
                        return (
                            <li
                                key={index}
                                onClick={() => {
                                    if (window.innerWidth < 992) HandleMobileMenu()
                                }}
                            >
                                <Link
                                    className={location.pathname === item.link ? "nav-item-active" : "nav-item"}
                                    to={item.link}
                                >{item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }

    function Logo() {

         function Button() {
            return (
                <button
                    id={"mobile-menu"}
                    className={"mobile-menu"}
                    onClick={HandleMobileMenu}
                >
                    <img
                        src="https://img.icons8.com/external-anggara-basic-outline-anggara-putra/32/333333/external-option-social-media-interface-anggara-basic-outline-anggara-putra-2.png"
                        alt={"hamburger-menu"}
                    />
                </button>
            );
        }

        return(
            <div id={"navbar-logo"}>
                <div id={"navbar-logo-wrapper"}>
                    <Button/>
                    <Link to={"/"}>Busy Bee</Link>
                    <img src="https://img.icons8.com/external-vitaliy-gorbachev-fill-vitaly-gorbachev/48/333333/external-bee-nature-resource-vitaliy-gorbachev-fill-vitaly-gorbachev.png" alt="bee"/>
                </div>
            </div>
        );
    }

    return (
        <nav id={"navbar"}>
            <div id={"navbar-wrapper"}>
                <List/>
                <Logo/>
            </div>
        </nav>
    );
}

export default Navbar;