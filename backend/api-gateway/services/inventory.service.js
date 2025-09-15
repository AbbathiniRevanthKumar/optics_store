const { createProxyMiddleware } = require("http-proxy-middleware");
const { consts } = require("../config/config");

exports.inventoryProxy = createProxyMiddleware({
  target: consts.inventory_service,
  changeOrigin: true,
  pathRewrite: (path) => {
    return "/inventory" + path;
  },
  on: {
    proxyReq: (proxyReq, req, res) => {            
      console.log("Forwarding:", req.method, req.originalUrl);
    },
    proxyRes: (proxyRes, req, res) => {
      console.log("Received response:", proxyRes.statusCode);
    },

    error: (err, req, res, target) => {
      const message = err.message || "service unreachable";
      console.log(`Proxy error to ${target.href}:`, message);
      res.status(500).json({
        success: false,
        error: "Proxy error",
        detail: message,
      });
    },
  },
});

exports.customerProxy = createProxyMiddleware({
  target: consts.inventory_service,
  changeOrigin: true,
  pathRewrite: (path) => {
    return "/customer" + path;
  },
  on: {
    proxyReq: (proxyReq, req, res) => {            
      console.log("Forwarding:", req.method, req.originalUrl);
    },
    proxyRes: (proxyRes, req, res) => {
      console.log("Received response:", proxyRes.statusCode);
    },

    error: (err, req, res, target) => {
      const message = err.message || "service unreachable";
      console.log(`Proxy error to ${target.href}:`, message);
      res.status(500).json({
        success: false,
        error: "Proxy error",
        detail: message,
      });
    },
  },
});

exports.ordersProxy = createProxyMiddleware({
  target: consts.inventory_service,
  changeOrigin: true,
  pathRewrite: (path) => {
    return "/orders" + path;
  },
  on: {
    proxyReq: (proxyReq, req, res) => {            
      console.log("Forwarding:", req.method, req.originalUrl);
    },
    proxyRes: (proxyRes, req, res) => {
      console.log("Received response:", proxyRes.statusCode);
    },

    error: (err, req, res, target) => {
      const message = err.message || "service unreachable";
      console.log(`Proxy error to ${target.href}:`, message);
      res.status(500).json({
        success: false,
        error: "Proxy error",
        detail: message,
      });
    },
  },
});

