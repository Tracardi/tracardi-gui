const envs = {
    commercial: window._env_.MODE === 'commercial',
    freezeProduction: window._env_.FREEZE_PRODUCTION === 'true',
}

export default envs;