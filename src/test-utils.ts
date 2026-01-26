import {
  renderRouter,
  type RenderRouterOptions,
} from "expo-router/testing-library";
import Home from "./app/index";
import History from "./app/history";
import RootLayout from "./app/_layout";

export const APP_ROUTES = {
  index: Home,
  history: History,
  _layout: RootLayout,
};

export function renderApp(options: RenderRouterOptions) {
  return renderRouter(APP_ROUTES, options);
}
