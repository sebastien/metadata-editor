import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icons from "./Icons";

export default function() {
    return (
        <div className="Sidebar">
            <ul className="Sidebar-list">
                <li className="Sidebar-item">
                    <Link to="/datasets" className="Sidebar-link">
                        <span className="Sidebar-item-icon">
                            {Icons.Dataset}
                        </span>
                        Datasets
                    </Link>
                    <ul className="Sidebar-list">
                        <li className="Sidebar-item">
                            <Link to="/datasets/bbg" className="Sidebar-link">
                                <span className="Sidebar-item-icon">
                                    {Icons.Collection}
                                </span>
                                Bloomberg
                            </Link>
                        </li>
                        <li className="Sidebar-item">
                            <Link to="/datasets/bis" className="Sidebar-link">
                                <span className="Sidebar-item-icon">
                                    {Icons.Collection}
                                </span>
                                BIS
                            </Link>
                        </li>
                        <li className="Sidebar-item">
                            <Link
                                to="/datasets/findur"
                                className="Sidebar-link"
                            >
                                <span className="Sidebar-item-icon">
                                    {Icons.Collection}
                                </span>
                                FINDUR
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}
