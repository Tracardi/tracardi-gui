export default function getEventPayload(soure_id, profile_id, session_id, event_type, event_properties) {
    return {
        id: "event-id",
        source: {id: soure_id},
        "context": { },
        "profile": {"id": profile_id},
        "session": {"id": session_id},
        "properties": event_properties,
        "type": event_type,
    }
}