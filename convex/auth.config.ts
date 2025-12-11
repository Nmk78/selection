export default {
    providers: [
        {
            domain: process.env.CONVEX_SITE_URL || 'http://localhost:3000',
            applicationID: 'convex',
        },
    ],
    session: {
        jwt: {
            durationMs: 60000 * 60 * 24 * 365,
        },
    },
};
