const envs = {
    withDeployment: window._env_.MODE,
    freezeProduction: window._env_.FREEZE_PRODUCTION === 'true',
}

export default envs;