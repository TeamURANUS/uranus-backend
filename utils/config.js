const dotenv = require('dotenv');

dotenv.config();

const {
    PORT,
    HOST,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID,
    TYPE,
    PRIVATE_KEY_ID,
    PRIVATE_KEY,
    CLIENT_EMAIL,
    CLIENT_ID,
    AUTH_URI,
    TOKEN_URI,
    AUTH_PROVIDER_X509_CERT_URL,
    CLIENT_X509_CERT_URL,
    CALENDAR_PRIVATE_KEY_ID,
    CALENDAR_PRIVATE_KEY,
    CALENDAR_CLIENT_EMAIL,
    CALENDAR_CLIENT_ID,
    CALENDAR_CLIENT_X509_CERT_URL,
    CALENDAR_ID
} = process.env;


module.exports = {
    port: PORT,
    host: HOST,
    calendarId: CALENDAR_ID,
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
        measurementId: MEASUREMENT_ID,
    },
    serviceAccount: {
        type: TYPE,
        project_id: PROJECT_ID,
        private_key_id: PRIVATE_KEY_ID,
        private_key: PRIVATE_KEY,
        client_email: CLIENT_EMAIL,
        client_id: CLIENT_ID,
        auth_uri: AUTH_URI,
        token_uri: TOKEN_URI,
        auth_provider_x509_cert_url: AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: CLIENT_X509_CERT_URL
    },
    CREDENTIALS: {
        type: TYPE,
        project_id: PROJECT_ID,
        private_key_id: CALENDAR_PRIVATE_KEY_ID,
        private_key: CALENDAR_PRIVATE_KEY,
        client_email: CALENDAR_CLIENT_EMAIL,
        client_id: CALENDAR_CLIENT_ID,
        auth_uri: AUTH_URI,
        token_uri: TOKEN_URI,
        auth_provider_x509_cert_url: AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: CALENDAR_CLIENT_X509_CERT_URL
    }
}
