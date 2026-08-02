const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// استثناء node_modules من أداة المراقبة التلقائية لتفادي خطأ ENOSPC
config.resolver.blacklistRE = /node_modules\/.*$/;
config.watcher.healthCheck.enabled = false;

module.exports = config;
