export const custom = {
    segment: {
        display: {
            details: {}
        }
    },
    profile: {
        disable: false,
        id: "Train id",
        name: "Train",
        plural: "Trains",
        icon1: "train",
        icon2: "train",
        display: {
            row: {
                id: "id"
            },
            details: {
                pii: false,
                segments: false,
                stats: false,
            }
        }
    },
    event: {
        disable: false,
        name: "Event",
        plural: "Events",
        display: {
            row: {
                channel: false,
                session: false,
                source: false,
                createTime: true
            }
        }
    },
    session: {
        disable: false,
        display: {
            row: {
                moreContext: false,
                context: false,
                channel: false
            }
        }
    },
    entity: {
        name: "Entity",
        plural: "Entities",
        disable: true
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
            disable: true
        },
        reporting: {
            name: "Reporting",
            disable: false
        },
        outbound: {
            disable: true
        },
        resources: {
            name: "Resources",
            disable: false
        },
        consents: {
            disable: true
        },
        test: {
            name: "Test",
            disable: false
        },
        import: {
            name: "Import",
            disable: true
        }
    }
}

