import React, { useEffect } from 'react'
import { HashRouter, Link, Route, Switch } from 'react-router-dom'
import GlobalNavigation from '@atlaskit/global-navigation'
import AppIcon from '@atlaskit/icon/glyph/media-services/spreadsheet'
import {
  LayoutManagerWithViewController,
  NavigationProvider,
  withNavigationViewController
} from '@atlaskit/navigation-next'
import DomainPage, { DomainView } from './pages/DomainPage'
import DatasetListPage, { DatasetListView } from './pages/DatasetListPage'
import DatasetPage from './pages/DatasetPage'
import HomePage from './pages/HomePage'

import './styles.css'

const AppGlobalNavigation = () => (
  <GlobalNavigation
    productIcon={AppIcon}
    productHref='#index'
    searchLabel='Search Label'
    helpItems={() => <div>Help</div>}
  />
)

const LinkItem = ({ components: { Item }, to, ...props }) => {
  return (
    <Route
      render={({ location: { pathname } }) => (
        <Item
          component={({ children, className }) => (
            <Link className={className} to={to}>
              {children}
            </Link>
          )}
          isSelected={pathname === to}
          {...props}
        />
      )}
    />
  )
}

// FIXME: Maybe rename that?
const ProductHomeView = {
  id: 'product/home',
  type: 'product',
  getItems: () => [
    {
      type: 'HeaderSection',
      id: 'product/home:header',
      items: [
        {
          type: 'Wordmark',
          wordmark: () => {
            return (
              <div
                style={{
                  fontSize: '30px',
                  fontWeight: 700,
                  lineHeight: '30px'
                }}
              >
                                DatCat
              </div>
            )
          },
          id: 'product-wordmark'
        }
      ]
    },
    {
      type: 'MenuSection',
      id: 'product/home:menu',
      items: [
        {
          type: 'InlineComponent',
          component: LinkItem,
          id: 'datasets',
          text: 'Datasets',
          to: '/datasets'
        }
      ]
    }
  ]
}

// NOTE: This begs for abastraction, but the useEffect prevents from
// using a factory function, as we'd get the following error:
//  React Hook "useEffect" is called in function "routeBase" which is
//  neither a React function component or a custom React Hook function  react-hooks/rules-of-hooks

const HomeRouteBase = props => {
  const navigationViewController = props.navigationViewController
  useEffect(() => {
    navigationViewController.setView(ProductHomeView.id)
  }, [navigationViewController])
  return <HomePage concept={props.match.params.concept} />
}
const HomeRoute = withNavigationViewController(HomeRouteBase)

const DatasetsRouteBase = props => {
  const navigationViewController = props.navigationViewController
  useEffect(() => {
    navigationViewController.setView(DatasetListView.id)
  }, [navigationViewController])

  return <DatasetListPage prefix={props.match.params.prefix} />
}
const DatasetsRoute = withNavigationViewController(DatasetsRouteBase)

const DatasetRouteBase = props => {
  const navigationViewController = props.navigationViewController
  useEffect(() => {
    navigationViewController.setView(DatasetListView.id)
  }, [navigationViewController])

  return <DatasetPage dataset={props.match.params.dataset} />
}
const DatasetRoute = withNavigationViewController(DatasetRouteBase)

const DomainRouteBase = props => {
  const navigationViewController = props.navigationViewController
  useEffect(() => {
    navigationViewController.setView(DomainView.id)
  }, [navigationViewController])

  return <DomainPage concept={props.match.params.concept} />
}
const DomainRoute = withNavigationViewController(DomainRouteBase)

const App = props => {
  const navigationViewController = props.navigationViewController
  useEffect(
    _ => {
      navigationViewController.addView(ProductHomeView)
      navigationViewController.addView(DatasetListView)
      navigationViewController.addView(DomainView)
    },
    [navigationViewController]
  )

  return (
    <LayoutManagerWithViewController globalNavigation={AppGlobalNavigation}>
      <Switch>
        <Route
          path={['/datasets/:prefix', '/datasets']}
          component={DatasetsRoute}
        />
        <Route path={['/dataset/:dataset']} component={DatasetRoute} />
        <Route
          path={['/domain/:concept', '/domain']}
          component={DomainRoute}
        />
        <Route path={['/', '/index']} component={HomeRoute} />
      </Switch>
    </LayoutManagerWithViewController>
  )
}
const AppWithNavigationViewController = withNavigationViewController(App)

export default function () {
  return (
    <HashRouter>
      <NavigationProvider>
        <AppWithNavigationViewController />
      </NavigationProvider>
    </HashRouter>
  )
}
