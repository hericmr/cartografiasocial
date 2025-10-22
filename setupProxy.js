const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/supabase',
    createProxyMiddleware({
      target: 'https://kbekziboncpvjqffmhlx.supabase.co',
      changeOrigin: true,
      pathRewrite: {
        '^/api/supabase': '', // remove /api/supabase from the path
      },
      onError: function (err, req, res) {
        console.log('Proxy Error:', err);
      },
      onProxyReq: function (proxyReq, req, res) {
        console.log('Proxying request to:', proxyReq.path);
      }
    })
  );
};