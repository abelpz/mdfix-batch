
async function linter(regex, target, message) {
    if (regex.test(target))
        return message;

    else
        return null;
}

async function lintNonTranslated(target) {

    //Fill dictionary with words common in English that are not part of your target language
    const dict = [
        'you',
        'I',
        'to',
        'be',
        'are',
        'is',
        'that'
    ];

    const found = dict.some(word => target.includes(` ${word} `));
    let message = found ? '- Possible partially untranslated document' : null;

    return message;
}

async function lintTitlesNLists(target) {
    const regexTitlesNLists = /(?:\s+([#*] ?\W*\w? *[-_]*) *\n)|(?:\s+([#*] ?\w+ *[-_]+) *\n)/gm;
    const message = '- Possible error in list or title format (Check list or title too short or ending in unexpected character)';
    return await linter(regexTitlesNLists, target, message);
}

async function lintQuotes(target) {
    const regexQuotes = / ”|“ |"|”\w|\w“/gm;
    const message = '- Possible format errors with quotation marks or missing quotation marks';

    return await linter(regexQuotes, target, message);
}

async function lintQuoteDots(target) {
    const regexQuotes = /\.”/gm;
    const message = '- [In spanish] Dots should be after quotation mark. Found .” should be ”.';

    return await linter(regexQuotes, target, message);
}

async function countParentheses(target) {
    const openP = /\(/g;
    const closeP = /\)/g;

    const openQty = (target.match(openP) || []).length
    const closeQty = (target.match(closeP) || []).length

    const difference = Math.abs(openQty - closeQty)

    if (difference != 0)
        if (openQty < closeQty)
            return `- Missing ${difference} '(' parentheses`;

        else
            return `- Missing ${difference} ')' parentheses`;

    else
        return null;
}

async function lintMissingParentheses(target) {
    const message = countParentheses(target);
    return message;
}
export async function lint(target) {
    let warnings = [];
    warnings.push(await lintQuotes(target))
    warnings.push(await lintQuoteDots(target))
    warnings.push(await lintTitlesNLists(target))
    warnings.push(await lintNonTranslated(target))
    warnings.push(await lintMissingParentheses(target))
    return warnings.filter(Boolean).join('\n');
}
