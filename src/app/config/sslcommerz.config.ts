// config/sslcommerz.config.ts
import { SslCommerz } from "@siamf/sslcommerz";
import { envVars } from "./env";

export const sslcz = new SslCommerz(
  envVars.SSL_COMMERZ_STORE_ID,
  envVars.SSL_COMMERZ_STORE_PASSWORD,
  envVars.SSL_COMMERZ_IS_LIVE === 'true'
);