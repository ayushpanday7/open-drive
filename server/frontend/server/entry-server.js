import { jsxs, jsx } from "react/jsx-runtime";
import { renderToPipeableStream } from "react-dom/server";
import React, { useEffect, useState, Suspense, StrictMode } from "react";
import { useRoutes, StaticRouter } from "react-router-dom";
const loaderImage1 = "/assets/loader-1-D2rOjnqc.jpg";
const loaderImage2 = "/assets/loader-2-DSvJGOPf.jpg";
const loaderImage3 = "/assets/loader-3-CgkK2Uah.jpg";
const loaderImage4 = "/assets/loader-4-V_dHm3Xa.jpg";
function Loader$1() {
  useEffect(() => {
    Promise.resolve({                  });
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "initial-loader-component", children: [
    /* @__PURE__ */ jsxs("div", { className: "loader-image-group-container", children: [
      /* @__PURE__ */ jsxs("div", { className: "loader-image-group", children: [
        /* @__PURE__ */ jsx("img", { src: loaderImage1, className: "initial-loader-image", alt: "loader 1" }),
        /* @__PURE__ */ jsx("img", { src: loaderImage2, className: "initial-loader-image", alt: "loader 2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "loader-image-group", children: [
        /* @__PURE__ */ jsx("img", { src: loaderImage3, className: "initial-loader-image", alt: "loader 3" }),
        /* @__PURE__ */ jsx("img", { src: loaderImage4, className: "initial-loader-image", alt: "loader 4" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "loader-progress-container", children: [
      /* @__PURE__ */ jsx("div", { children: "Please wait" }),
      /* @__PURE__ */ jsx("div", { className: "loader-progress-bar" })
    ] })
  ] });
}
function Loader() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5e3);
  }, []);
  return loading ? /* @__PURE__ */ jsx(Loader$1, {}) : null;
}
function Login() {
  return /* @__PURE__ */ jsx("div", { children: "Login" });
}
function Register() {
  return /* @__PURE__ */ jsx("div", { children: "Register" });
}
const routes = [{ "caseSensitive": false, "path": "/", "element": React.createElement(Loader) }, { "caseSensitive": false, "path": "auth", "children": [{ "caseSensitive": false, "path": "login", "element": React.createElement(Login) }, { "caseSensitive": false, "path": "register", "element": React.createElement(Register) }] }];
function App() {
  return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("p", { children: "Loading..." }), children: useRoutes(routes) });
}
function render(url, options) {
  return renderToPipeableStream(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) }) }),
    options
  );
}
export {
  render
};
