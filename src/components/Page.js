import React from 'react'
import { Link, HashRouter, Route, Switch } from 'react-router-dom'
import Icons from './Icons'
import Sidebar from '../components/Sidebar'
import SmartQuery from '../components/SmartQuery'
export default function (props) {
  return (
    <div className='DatCat'>
      <header className='DatCat-header'>
        <Link className='DatCat-header-logo' to='/'>
          <span className='DatCat-header-logo-icon'>{Icons.DatCat}</span>
          <span className='DatCat-header-logo-label'>DatCat</span>
        </Link>
        <div className='DatCat-header-query'>
          <HashRouter>
            <Switch>
              <Route exact path='/'><div className='Datcat-header-placeholder' /></Route>
              <Route path='/:query+' component={SmartQuery} />
            </Switch>
          </HashRouter>
        </div>
        <div className='DatCat-header-actions' />
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
