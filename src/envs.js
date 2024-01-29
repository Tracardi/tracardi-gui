const envs = {
    withDeployment: window._env_.MODE,
    allowUpdatesOnProduction: window._env_.ALLOW_UPDATES_ON_PRODUCTION === 'false',
}

export default envs;