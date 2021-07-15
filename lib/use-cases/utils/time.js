export function getDateByYear(year) {
    return new Date(Date.UTC(year, 0, 1));
}

export function getCurrentYear() {
    return new Date().getFullYear();
}
