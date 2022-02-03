const log4js = require('log4js');
const router = require('express').Router();

const httpClient = require('./http-client');
const routerUtils = require('./utils/router.utils');

const logger = log4js.getLogger(global.loggerName);
routerUtils.initRouterMap();

router.use(async (req, res) => {
    try {
        const path = req.path;
        const method = req.method;
        const proxyPath = global.activeFlows[path];
        logger.info('Proxying request to: ', proxyPath);
        const resp = await httpClient.httpRequest({
            method,
            url: proxyPath,
            headers: req.headers,
            json: req.body
        });
        res.status(resp.statusCode).json(resp.body);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;