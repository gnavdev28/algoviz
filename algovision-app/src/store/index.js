/**
 * Store Configuration (Local Persistence)
 * Aligning with Report.md 3-tier Architecture (Data Tier)
 */

export const STORAGE_KEYS = {
    UNLOCKED_ALGOS: 'unlocked_algos',
    THEME: 'theme-mode',
};

export const saveToLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocal = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};
