
export function stringToDate(date: string): string {
    // Create a Date object from the string
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit", // Two-digit day
        month: "short", // Abbreviated month name
        year: "numeric", // Full year
    });

    return formattedDate;
}