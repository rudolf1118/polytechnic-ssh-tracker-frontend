export const getStartDate = (str: string) => {
    const parts = str.split(' ');
    if (parts.length < 5) return new Date(0); // fallback
    const [weekday, month, day, time] = parts;
    const year = new Date().getFullYear();
    return new Date(`${month} ${day} ${year} ${time}`);
};

export const parseDuration = (durationStr: string) => {
    const [hours, minutes, seconds] = durationStr.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + (seconds || 0);
};