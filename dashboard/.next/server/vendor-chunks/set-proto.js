"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/set-proto";
exports.ids = ["vendor-chunks/set-proto"];
exports.modules = {

/***/ "(rsc)/./node_modules/set-proto/Object.setPrototypeOf.js":
/*!*********************************************************!*\
  !*** ./node_modules/set-proto/Object.setPrototypeOf.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar $Object = __webpack_require__(/*! es-object-atoms */ \"(rsc)/./node_modules/es-object-atoms/index.js\");\n\n/** @type {import('./Object.setPrototypeOf')} */\nmodule.exports = $Object.setPrototypeOf || null;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc2V0LXByb3RvL09iamVjdC5zZXRQcm90b3R5cGVPZi5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixjQUFjLG1CQUFPLENBQUMsc0VBQWlCOztBQUV2QyxXQUFXLG1DQUFtQztBQUM5QyIsInNvdXJjZXMiOlsid2VicGFjazovL2NsYXVkZS1mcmFtZXdvcmstZGFzaGJvYXJkLy4vbm9kZV9tb2R1bGVzL3NldC1wcm90by9PYmplY3Quc2V0UHJvdG90eXBlT2YuanM/ZWQ1NyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnZXMtb2JqZWN0LWF0b21zJyk7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL09iamVjdC5zZXRQcm90b3R5cGVPZicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSAkT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8IG51bGw7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/set-proto/Object.setPrototypeOf.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/set-proto/Reflect.setPrototypeOf.js":
/*!**********************************************************!*\
  !*** ./node_modules/set-proto/Reflect.setPrototypeOf.js ***!
  \**********************************************************/
/***/ ((module) => {

eval("\n\n/** @type {import('./Reflect.setPrototypeOf')} */\nmodule.exports = (typeof Reflect !== 'undefined' && Reflect.setPrototypeOf) || null;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc2V0LXByb3RvL1JlZmxlY3Quc2V0UHJvdG90eXBlT2YuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsV0FBVyxvQ0FBb0M7QUFDL0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbGF1ZGUtZnJhbWV3b3JrLWRhc2hib2FyZC8uL25vZGVfbW9kdWxlcy9zZXQtcHJvdG8vUmVmbGVjdC5zZXRQcm90b3R5cGVPZi5qcz8xODdkIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vUmVmbGVjdC5zZXRQcm90b3R5cGVPZicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSAodHlwZW9mIFJlZmxlY3QgIT09ICd1bmRlZmluZWQnICYmIFJlZmxlY3Quc2V0UHJvdG90eXBlT2YpIHx8IG51bGw7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/set-proto/Reflect.setPrototypeOf.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/set-proto/index.js":
/*!*****************************************!*\
  !*** ./node_modules/set-proto/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar reflectSetProto = __webpack_require__(/*! ./Reflect.setPrototypeOf */ \"(rsc)/./node_modules/set-proto/Reflect.setPrototypeOf.js\");\nvar originalSetProto = __webpack_require__(/*! ./Object.setPrototypeOf */ \"(rsc)/./node_modules/set-proto/Object.setPrototypeOf.js\");\n\nvar setDunderProto = __webpack_require__(/*! dunder-proto/set */ \"(rsc)/./node_modules/dunder-proto/set.js\");\n\nvar $TypeError = __webpack_require__(/*! es-errors/type */ \"(rsc)/./node_modules/es-errors/type.js\");\n\n/** @type {import('.')} */\nmodule.exports = reflectSetProto\n\t? function setProto(O, proto) {\n\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\n\t\tif (reflectSetProto(O, proto)) {\n\t\t\treturn O;\n\t\t}\n\t\tthrow new $TypeError('Reflect.setPrototypeOf: failed to set [[Prototype]]');\n\t}\n\t: originalSetProto || (\n\t\tsetDunderProto ? function setProto(O, proto) {\n\t\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\n\t\t\tsetDunderProto(O, proto);\n\t\t\treturn O;\n\t\t} : null\n\t);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvc2V0LXByb3RvL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLHNCQUFzQixtQkFBTyxDQUFDLDBGQUEwQjtBQUN4RCx1QkFBdUIsbUJBQU8sQ0FBQyx3RkFBeUI7O0FBRXhELHFCQUFxQixtQkFBTyxDQUFDLGtFQUFrQjs7QUFFL0MsaUJBQWlCLG1CQUFPLENBQUMsOERBQWdCOztBQUV6QyxXQUFXLGFBQWE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbGF1ZGUtZnJhbWV3b3JrLWRhc2hib2FyZC8uL25vZGVfbW9kdWxlcy9zZXQtcHJvdG8vaW5kZXguanM/MDhmMSJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciByZWZsZWN0U2V0UHJvdG8gPSByZXF1aXJlKCcuL1JlZmxlY3Quc2V0UHJvdG90eXBlT2YnKTtcbnZhciBvcmlnaW5hbFNldFByb3RvID0gcmVxdWlyZSgnLi9PYmplY3Quc2V0UHJvdG90eXBlT2YnKTtcblxudmFyIHNldER1bmRlclByb3RvID0gcmVxdWlyZSgnZHVuZGVyLXByb3RvL3NldCcpO1xuXG52YXIgJFR5cGVFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycy90eXBlJyk7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IHJlZmxlY3RTZXRQcm90b1xuXHQ/IGZ1bmN0aW9uIHNldFByb3RvKE8sIHByb3RvKSB7XG5cdFx0Ly8gQHRzLWV4cGVjdC1lcnJvciBUUyBjYW4ndCBuYXJyb3cgaW5zaWRlIGEgY2xvc3VyZSwgZm9yIHNvbWUgcmVhc29uXG5cdFx0aWYgKHJlZmxlY3RTZXRQcm90byhPLCBwcm90bykpIHtcblx0XHRcdHJldHVybiBPO1xuXHRcdH1cblx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignUmVmbGVjdC5zZXRQcm90b3R5cGVPZjogZmFpbGVkIHRvIHNldCBbW1Byb3RvdHlwZV1dJyk7XG5cdH1cblx0OiBvcmlnaW5hbFNldFByb3RvIHx8IChcblx0XHRzZXREdW5kZXJQcm90byA/IGZ1bmN0aW9uIHNldFByb3RvKE8sIHByb3RvKSB7XG5cdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFRTIGNhbid0IG5hcnJvdyBpbnNpZGUgYSBjbG9zdXJlLCBmb3Igc29tZSByZWFzb25cblx0XHRcdHNldER1bmRlclByb3RvKE8sIHByb3RvKTtcblx0XHRcdHJldHVybiBPO1xuXHRcdH0gOiBudWxsXG5cdCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/set-proto/index.js\n");

/***/ })

};
;