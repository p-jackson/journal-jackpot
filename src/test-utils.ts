import path from "path";
import {
  renderRouter,
  type RenderRouterOptions,
} from "expo-router/testing-library";

export function renderApp(options: RenderRouterOptions) {
  return renderRouter(path.resolve(__dirname, "app"), options);
}
