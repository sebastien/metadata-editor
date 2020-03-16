import React, { useEffect } from "react";
import { HashRouter, Link, Route, Switch } from "react-router-dom";
import GlobalNavigation from "@atlaskit/global-navigation";
import AppIcon from "@atlaskit/icon/glyph/media-services/spreadsheet";
import {
  LayoutManagerWithViewController,
  NavigationProvider,
  withNavigationViewController
} from "@atlaskit/navigation-next";
import EditorPage from "./pages/EditorPage";
import DomainPage from "./pages/DomainPage";
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
          id: "datasets",
          text: "Datasets",
          to: "/datasets"
        },
        {
          type: "InlineComponent",
          component: LinkItem,
          id: "domain",
          text: "Domain",
          to: "/domain"
        }
      ]
    }
  ]
};

const CatalogueRouteBase = props => {
  const navigationViewController = props.navigationViewController;
  useEffect(() => {
    navigationViewController.setView(productHomeView.id);
  }, [navigationViewController]);

  return <CataloguePage prefix={props.match.params.prefix} />;
};
const CatalogueRoute = withNavigationViewController(CatalogueRouteBase);

const EditorRouteBase = props => {
  const navigationViewController = props.navigationViewController;
  useEffect(() => {
    navigationViewController.setView(productHomeView.id);
  }, [navigationViewController]);

  return <EditorPage dataset={props.match.params.datasetId} />;
};
const EditorRoute = withNavigationViewController(EditorRouteBase);

const DomainRouteBase = props => {
  const navigationViewController = props.navigationViewController;
  useEffect(() => {
    navigationViewController.setView(productHomeView.id);
  }, [navigationViewController]);

  return <DomainPage dataset={props.match.params.datasetId} />;
};
const DomainRoute = withNavigationViewController(DomainRouteBase);

const App = props => {
  const navigationViewController = props.navigationViewController;
  useEffect(
    _ => {
      navigationViewController.addView(productHomeView);
    },
    [navigationViewController]
  );

  return (
    <LayoutManagerWithViewController globalNavigation={AppGlobalNavigation}>
      <Switch>
        <Route
          path={["/datasets/:prefix", "/datasets"]}
          component={CatalogueRoute}
        />
        <Route path="/domain" component={DomainRoute} />
        <Route path="/editor/:datasetId" component={EditorRoute} />
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
