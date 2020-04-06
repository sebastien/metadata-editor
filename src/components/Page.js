import React from 'react'
import { Link } from 'react-router-dom'
import Icons from './Icons'
import Sidebar from '../components/Sidebar'
export default function (props) {
  return (
    <div className='DatCat'>
      <header className='DatCat-header'>
        <Link className='DatCat-header-logo' to='/datasets'>
          <span className='DatCat-header-logo-icon'>{Icons.DatCat}</span>
          <span className='DatCat-header-logo-label'>DatCat</span>
        </Link>
      </header>
      <section className='DatCat-body'>
        <nav className='DatCat-sidebar'><Sidebar /></nav>
        <section className='DatCat-content'>
          <div className='DatCat-content__wrapper'>
            {props.children}
          </div>
        </section>
      </section>
    </div>
  )
}
