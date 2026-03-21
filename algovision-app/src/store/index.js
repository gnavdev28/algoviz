/**
 * Cấu hình lưu trữ (Lưu trữ cục bộ)
 * Phù hợp với Kiến trúc 3 tầng trong Report.md (Tầng dữ liệu)
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
