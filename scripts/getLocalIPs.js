const os = require('os');

/** Get local externel ip addresses */
const getLocalIPs = () => {
  const networkInterfaces = os.networkInterfaces();
  return Object.values(networkInterfaces).reduce((acc, dev) => {
    const addresses = dev.reduce((res, details) => {
      if (details.family === 'IPv4' && !details.internal) {
        res.push(details.address);
      }
      return res;
    }, []);

    if (addresses.length > 0) {
      acc.push(addresses[0]);
    }
    return acc;
  }, []);
};

module.exports = getLocalIPs;
