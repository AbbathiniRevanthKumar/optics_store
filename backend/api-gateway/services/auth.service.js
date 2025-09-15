const { createProxyMiddleware } = require("http-proxy-middleware");
const { consts } = require("../config/config");

exports.authProxy = createProxyMiddleware({
  target: consts.auth_service,
  changeOrigin: true,
  pathRewrite: (path) => {
    return "/auth" + path;
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

