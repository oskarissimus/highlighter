module.exports = function override(config, env) {
    // Add a loader for .tmLanguage files
    config.module.rules.push({
        test: /\.tmLanguage$/,
        type: 'asset/source'
    });

    return config;
};
