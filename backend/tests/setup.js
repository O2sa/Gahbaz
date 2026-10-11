import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_key_min_32_chars_123456";
process.env.JWT_LIFETIME = process.env.JWT_LIFETIME || "1d";
process.env.MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/gahbaz_test";
process.env.EMAIL_USER = process.env.EMAIL_USER || "test@gahbaz.com";
process.env.EMAIL_PASS = process.env.EMAIL_PASS || "dummy_pass";
