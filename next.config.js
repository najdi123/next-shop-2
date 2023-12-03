/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_ID:
      "498779275456-cgj4kaao0lf2j34rmo3vejo8clns4bma.apps.googleusercontent.com",
    GOOGLE_SECRET: "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",
    MONGODB_URI: "mongodb+srv://nextshop2:asdasdasd@cluster0.yjt3bhz.mongodb.net/?retryWrites=true&w=majority",
    MINIO_URL: "http://localhost:9090/api/v1/service-account-credentials",
    MINIO_URL2: "http://192.168.158.88",
    MINIO_URL3: "play.min.io",
    MINIO_accessKey: "yBC13x5Xpz8ScNpuvP6z",
    MINIO_secretKey: "1X9PxVHNxHndPU6dt9YWPHAuYNJvYDpgpkpy7Z1t",
    MINIO_serviceAccount_accessKey: "XBrjBQk9nehp7QvvwMIj",
    MINIO_serviceAccount_secretKey: "MDmnxifI72BHSk2v4ieiwApe95yf0hFnNXSUgPuT",
    MINIO_ROOT_USER: "minioadmin",
    MINIO_ROOT_PASSWORD: "minioadmin",
  },
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;