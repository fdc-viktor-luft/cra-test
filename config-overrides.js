/**
 * ! HERE BE DRAGONS !
 *
 * This file is parsed by `rewire-react-app`.
 * It allows you to change the webpack configuration without `eject`-ing from
 * the create-react-app ecosystem.
 * Everything you do here has an impact on some poor developer who will
 * want to retroactively murder you while he is upgrading create-react-app.
 * Keep changes to a bare minimum.
 */
const TerserPlugin = require('terser-webpack-plugin');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const takeClosureCompiler = config => {
    config.optimization.minimizer = config.optimization.minimizer.map(minimizer => minimizer instanceof TerserPlugin ? new ClosureCompilerPlugin({
        compiler: {
            language_in: 'ECMASCRIPT_2017',
            language_out: 'ECMASCRIPT3',
            compilation_level: 'SIMPLE',
        },
    }) : minimizer)
};

const noInlineDataImages = config => {
    const previousValue = config.module.rules[2].oneOf[0].options.limit;
    if (previousValue !== 10000) {
        throw new Error(
            'Something changed within react scripts. Maybe the value has moved, but we want to replace it. If we do not do this, some images will hit our CSP'
        );
    }
    config.module.rules[2].oneOf[0].options.limit = 1;
};

const removeInlineChunkPlugin = config => {
    config.plugins = config.plugins.filter(plugin => !(plugin instanceof InlineChunkHtmlPlugin));
};

const removeServiceWorkerPlugin = config => {
    config.plugins = config.plugins.filter(plugin => !(plugin instanceof WorkboxWebpackPlugin.GenerateSW));
};

module.exports = {
    webpack: function override(config, env) {
        const isLocalDevelopment = process.env.NODE_ENV === 'development';

        !isLocalDevelopment && takeClosureCompiler(config);
        !isLocalDevelopment && noInlineDataImages(config);
        removeInlineChunkPlugin(config); // this would violate often CSP regulations
        removeServiceWorkerPlugin(config); // we do not want any service worker to avoid caching problems

        return config;
    },
};
