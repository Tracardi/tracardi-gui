import React, { useState, useEffect } from 'react';
import { useFetch } from "../../../remote_api/remoteState";
import { getProfileCacheTTL } from "../../../remote_api/endpoints/cache";
import { convertSecToMinSec } from "../../../misc/converters";

export default function ProfileCacheDetails({ id }) {
    const { isLoading, data, error } = useFetch(
        [`ProfileCache-${id}`, [id]],
        getProfileCacheTTL(id),
        data => data,
        { retry: 0 }
    );

    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        if (data?.ttl >= 0) {
            const interval = setInterval(() => {
                setCountdown(prevCountdown => {
                    const newTtl = prevCountdown > 0 ? prevCountdown - 1 : 0;
                    return newTtl;
                });
            }, 1000);

            // Cleanup interval on component unmount
            return () => clearInterval(interval);
        }
    }, [data]);

    useEffect(() => {
        // Initialize countdown state when data changes
        if (data?.ttl >= 0) {
            setCountdown(data.ttl);
        }
    }, [data]);

    if (isLoading) {
        return "Loading...";
    }

    if (error) {
        return "Error loading data";
    }

    function renderCountdown() {
        if (countdown < 0) {
            return "Not In Cache";
        }
        return convertSecToMinSec(countdown);
    }

    return <span style={{ backgroundColor: 'rgba(128,149,196, 0.5)', color: 'rgba(0,0,0, 1)', padding: "1px 7px", borderRadius: 6 }}>
        {renderCountdown()}
    </span>;
}
