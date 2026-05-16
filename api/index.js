const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const auth = req.headers['authorization'] || '';
  const [scheme, encoded] = auth.split(' ');

  if (scheme === 'Basic' && encoded) {
    try {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      const colonIdx = decoded.indexOf(':');
      const user = decoded.substring(0, colonIdx);
      const pass = decoded.substring(colonIdx + 1);

      if (user === process.env.UDI && pass === process.env.UDIPW) {
        const htmlPath = path.join(__dirname, '..', 'Index.html');
        const html = fs.readFileSync(htmlPath, 'utf-8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(html);
        return;
      }
    } catch (_) {}
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="The Marketing Cloud", charset="UTF-8"');
  res.status(401).send('Authentication required');
};
