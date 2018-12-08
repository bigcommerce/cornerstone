const throttling = {
    disabled: {
        rttMs: 0,
        throughputKbps: 0,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
        cpuSlowdownMultiplier: 0,
    }
};

module.exports = {
    settings: {
        output: 'json',
        maxWaitForLoad: 45 * 1000,
        throttlingMethod: 'provided',
        throttling: throttling.disabled,
        auditMode: false,
        gatherMode: false,
        disableStorageReset: false,
        disableDeviceEmulation: true,
        emulatedFormFactor: 'none',
        blockedUrlPatterns: null,
        additionalTraceCategories: null,
        extraHeaders: null,
        onlyAudits: null,
        onlyCategories: null,
        skipAudits: null,
    },
    passes: [
        {
            passName: 'defaultPass',
            recordTrace: true,
            useThrottling: false,
            pauseAfterLoadMs: 1000,
            networkQuietThresholdMs: 1000,
            cpuQuietThresholdMs: 1000,
            gatherers: [],
        },
    ],
    audits: [
        'time-to-first-byte',
        'metrics/first-meaningful-paint',
        'metrics/interactive',
    ],
};
