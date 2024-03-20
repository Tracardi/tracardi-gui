export function toUTCISOStringWithMilliseconds(date) {
    const pad = (num, size = 2) => String(num).padStart(size, '0');

    // Format UTC date and time components
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    const milliseconds = pad(date.getUTCMilliseconds(), 3);

    // Construct the UTC ISO string with milliseconds
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export function formatUTCDate(date) {
    const pad = num => String(num).padStart(2, '0');

    // Get UTC date components
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours();
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());

    // Convert 24-hour time to 12-hour time and determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? pad(hours) : '12'; // Convert hour '0' to '12'

    // Format the date string
    return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}
