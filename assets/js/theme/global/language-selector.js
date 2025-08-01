const getLocalizationSettings = async (storefrontAPIToken) => {
    const response = await fetch('/graphql', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storefrontAPIToken}`,
        },
        body: JSON.stringify({
            query: `
                query {
                    site {
                        settings {
                            url {
                                vanityUrl
                            }
                            locales {
                                code
                                isDefault
                            }
                        }
                    }
                }
            `,
        }),
    });

    const result = await response.json();
    const settings = result?.data?.site?.settings; 
    // console.log('###_settings: ', settings);

    if (!settings) {
        throw new Error('Failed to fetch language selector settings');
    }

    return settings;
};


export default async function languageSelector(storefrontAPIToken) {
    // console.log('###_lang -> storefrontAPIToken: ', storefrontAPIToken);
    try {
        const { locales, url } = await getLocalizationSettings(storefrontAPIToken);
        // console.log('###_lang -> locales: ', locales);
        // console.log('###_lang -> url: ', url);
    } catch (error) {
        console.error('Failed to initialize language selector: ', error);
    }
}
