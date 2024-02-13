import {custom} from './custom.js';

const getConfig = () => {
    return {
        segment: {
            display: {
                details: {}
            }
        },
        profile: {
            disable: false,
            id: "Profile id",
            name: "Profile",
            plural: "Profiles",
            icon1: "profile",
            icon2: "profile-less",
            display: {
                row: {
                    id: "name"
                },
                details: {
                    pii: true,
                    segments: true,
                    stats: true,
                }
            }
        },
        event: {
            disable: false,
            name: "Event",
            plural: "Events",
            display: {
                row: {
                    channel: true,
                    session: true,
                    source: true,
                    createTime: true
                }
            }
        },
        session: {
            disable: false,
            display: {
                row: {
                    moreContext: true,
                    context: true,
                    channel: true
                }
            }
        },
        entity: {
            name: "Entity",
            plural: "Entities",
            disable: false
        },
        menu: {
            inbound: {
                name: "Inbound traffic",
                disable: false
            },
            data: {
                name: "Data",
                disable: false
            },
            integration: {
                name: "Integration",
                disable: false
            },
            segmentation: {
                name: "Segmentation",
                disable: false
            },
            routing: {
                name: "Routing",
                disable: false
            },
            triggers: {
                name: "Triggers",
                disable: false
            },
            metrics: {
                name: "Metrics",
                disable: false
            },
            transformations: {
                name: "Collection",
                disable: false
            },
            identification: {
                name: "Identification",
                disable: false
            },
            reporting: {
                name: "Reporting",
                disable: false
            },
            outbound: {
                name: "Outbound traffic",
                disable: false
            },
            audience: {
                name: "Audience",
                disable: false
            },
            resources: {
                name: "Resources",
                disable: false
            },
            consents: {
                name: "Consents",
                disable: false
            },
            test: {
                name: "Test",
                disable: false
            },
            monitoring: {
                name: "Monitoring",
                disable: false
            },
            maintenance: {
                name: "Maintenance",
                disable: false
            },
            import: {
                name: "Import",
                disable: false
            },
            settings: {
                name: "Settings",
                disable: false
            }
        },
        ...custom
    }
}

window.CONFIG = getConfig()