import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Page from './components/Page'
import DatasetListPage from './pages/DatasetListPage'
import DatasetPage from './pages/DatasetPage'
import HomePage from './pages/HomePage'
import './styles.css'
import 'typeface-inter'

export default function () {
  return (
    <HashRouter>
      <main>
        <Page>
          <Switch>
            <Route exact path='/'>
              <HomePage />
            </Route>
            <Route
              path={['/datasets/:prefix', '/datasets']}
              component={DatasetListPage}
            />
            <Route
              path={['/dataset/:dataset', '/dataset']}
              component={DatasetPage}
            />
          </Switch>
        </Page>
      </main>
    </HashRouter>
  )
}
