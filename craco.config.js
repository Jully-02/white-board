module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.module.rules.push({
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false, // Tắt chế độ bắt buộc đuôi file
          },
        });
        return webpackConfig;
      },
    },
  };