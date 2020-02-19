import React, { Component, useEffect } from "react";
import { HashRouter, Link, Route, Switch } from "react-router-dom";
import GlobalNavigation from "@atlaskit/global-navigation";
import AppIcon from "@atlaskit/icon/glyph/media-services/spreadsheet";
import {
  LayoutManagerWithViewController,
  NavigationProvider,
  ViewController,
  withNavigationViewController
} from "@atlaskit/navigation-next";
import EditorPage from "./pages/EditorPage";
import CataloguePage from "./pages/CataloguePage";

import "./styles.css";

const AppGlobalNavigation = () => (
  <GlobalNavigation productIcon={AppIcon} onProductClick={() => {}} />
);

const LinkItem = ({ components: { Item }, to, ...props }: *) => {
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
  );
};

const productHomeView = {
  id: "product/home",
  type: "product",
  getItems: () => [
    {
      type: "HeaderSection",
      id: "product/home:header",
      items: [
        {
          type: "Wordmark",
          wordmark: () => {
            return (
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  lineHeight: "30px",
                  textTransform: "uppercase"
                }}
              >
                DataHub
              </div>
            );
          },

          id: "product-wordmark"
        }
      ]
    },
    {
      type: "MenuSection",
      id: "product/home:menu",
      items: [
        {
          type: "InlineComponent",
          component: LinkItem,
          id: "catalogue",
          text: "Catalogue",
          to: "/catalogue"
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          id: "editor",
          text: "Editor",
          to: "/editor"
        }
      ]
    }
  ]
};

const CatalogueRouteBase = props => {
  const navigationViewController = props.navigationViewController;
  useEffect(() => {
    navigationViewController.setView(productHomeView.id);
  }, [true]);

  return <CataloguePage />;
};
const CatalogueRoute = withNavigationViewController(CatalogueRouteBase);

const EditorRouteBase = props => {
  const navigationViewController = props.navigationViewController;
  useEffect(() => {
    navigationViewController.setView(productHomeView.id);
  }, [true]);

  return <EditorPage />;
};
const EditorRoute = withNavigationViewController(EditorRouteBase);

const App = props => {
  const navigationViewController = props.navigationViewController;
  useEffect(
    _ => {
      navigationViewController.addView(productHomeView);
    },
    [true]
  );

  return (
    <LayoutManagerWithViewController globalNavigation={AppGlobalNavigation}>
      <Switch>
        <Route path="/catalogue" component={CatalogueRoute} />
        <Route path="/editor" component={EditorRoute} />
      </Switch>
    </LayoutManagerWithViewController>
  );
};
const AppWithNavigationViewController = withNavigationViewController(App);

export default () => (
  <HashRouter>
    <NavigationProvider>
      <AppWithNavigationViewController />
    </NavigationProvider>
  </HashRouter>
);
