// export default {
    
//     providers: [
//         {
//             // domain: process.env.NEXT_PUBLIC_CONVEX_SITE_URL ,
//             domain: 'https://robust-llama-135.convex.site',
//             applicationID: 'convex',
//         },
//     ],
//     session: {
//         jwt: {
//             durationMs: 60000 * 60 * 24 * 365,
//         },
//     },
// };

export default {
    providers: [
      {
        domain: "https://robust-llama-135.convex.site", // must equal `iss`
        applicationID: "convex",                        // must equal `aud`
      },
    ],
  };