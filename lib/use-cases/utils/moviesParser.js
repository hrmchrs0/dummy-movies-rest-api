function moviesParser(text) {
    const result = [];

    const lines = text.split(/\r?\n/);
    const trimmedLines = lines.map(line => line.trim());
    const nonEmptyLines = trimmedLines.filter(line => line !== '');

    let counter = 0;

    while (counter + 3 < nonEmptyLines.length) {
        let title = nonEmptyLines[counter];
        let releaseYear = nonEmptyLines[counter + 1];
        let format = nonEmptyLines[counter + 2];
        let stars = nonEmptyLines[counter + 3];
        let starsList;

        const titleMatch = title.match(/Title: (.+)/);

        if (titleMatch) {
            title = titleMatch[1];
        } else {
            counter += 1;
            continue;
        }

        const releaseYearMatch = releaseYear.match(/Release Year: (.+)/);

        if (releaseYearMatch) {
            releaseYear = releaseYearMatch[1];
        } else {
            counter += 2;
            continue;
        }

        const formatMatch = format.match(/Format: (.+)/);

        if (formatMatch) {
            format = formatMatch[1];
        } else {
            counter += 3;
            continue;
        }

        const starsMatch = stars.match(/Stars: (.+)/);

        let starsListMatch;

        if (starsMatch) {
            stars = starsMatch[1];

            starsListMatch = stars.match(/\w+ \w+(?:, )?/g);

            if (starsListMatch) {
                starsList = starsListMatch.map(name => name.replace(', ', ''));
            }
        }

        if (!starsMatch || !starsListMatch) {
            counter += 4;
            continue;
        }

        result.push({ title, releaseYear, format, stars: starsList });

        counter += 4;
    }

    return result;
}

export default moviesParser;
