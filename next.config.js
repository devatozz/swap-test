require("dotenv").config();
module.exports = {
  reactStrictMode: true,

  images: {
    domains: ["localhost", "logos.covalenthq.com", "app.calamus.finance"],
  },
  compiler: {
    styledComponents: true,
  },
  i18n: {
    locales: ["en", "vi", "ru", "de", "fr", "zh", "ja", "ko", "hi", "ar"],
    defaultLocale: "en",
    localeDetection: false,
  },
  async headers() {
    return [
      {
        source: '/charting_library/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
