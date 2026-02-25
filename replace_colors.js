const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
    // Final remaining combinations of blue-50 and indigo-50 in gradients
    { regex: /from-blue-50\/50/g, replacement: 'from-lifewood-paper/50' },
    { regex: /to-indigo-50\/50/g, replacement: 'to-lifewood-seaSalt/50' },
    { regex: /from-blue-50/g, replacement: 'from-lifewood-paper' },
    { regex: /via-indigo-50/g, replacement: 'via-lifewood-seaSalt' },
    { regex: /to-indigo-50/g, replacement: 'to-lifewood-seaSalt' },
    { regex: /hover:from-blue-50/g, replacement: 'hover:from-lifewood-paper' },
    { regex: /hover:to-indigo-50/g, replacement: 'hover:to-lifewood-seaSalt' },
    // Remaining specific shades
    { regex: /bg-blue-300/g, replacement: 'bg-lifewood-saffaron/60' },
    { regex: /bg-indigo-300/g, replacement: 'bg-lifewood-castletonGreen/40' },
    { regex: /bg-purple-300/g, replacement: 'bg-lifewood-earthYellow/60' },
    { regex: /bg-blue-400/g, replacement: 'bg-lifewood-saffaron' },
    { regex: /bg-indigo-400/g, replacement: 'bg-lifewood-castletonGreen' },
    { regex: /bg-purple-400/g, replacement: 'bg-lifewood-earthYellow' },
    { regex: /bg-purple-500/g, replacement: 'bg-lifewood-saffaron' },
    { regex: /bg-purple-600/g, replacement: 'bg-lifewood-earthYellow' },
    { regex: /hover:bg-indigo-700/g, replacement: 'hover:bg-lifewood-darkSerpent' },
    { regex: /bg-indigo-100/g, replacement: 'bg-lifewood-seaSalt' },

    // Text
    { regex: /text-blue-800/g, replacement: 'text-lifewood-darkSerpent' },
    { regex: /text-blue-100/g, replacement: 'text-lifewood-paper' },
    { regex: /text-indigo-700/g, replacement: 'text-lifewood-darkSerpent' },
    { regex: /hover:text-blue-800/g, replacement: 'hover:text-lifewood-darkSerpent' },

    // Gradients
    { regex: /from-blue-400/g, replacement: 'from-lifewood-saffaron' },
    { regex: /via-indigo-400/g, replacement: 'via-lifewood-castletonGreen/50' },
    { regex: /to-purple-400/g, replacement: 'to-lifewood-earthYellow' },
    { regex: /from-indigo-500\/10/g, replacement: 'from-lifewood-castletonGreen/10' },
    { regex: /to-purple-500\/10/g, replacement: 'to-lifewood-saffaron/10' },
    { regex: /from-blue-100/g, replacement: 'from-lifewood-paper' },
    { regex: /to-indigo-100/g, replacement: 'to-lifewood-seaSalt' },
    { regex: /from-indigo-100/g, replacement: 'from-lifewood-seaSalt' },
    { regex: /to-purple-100/g, replacement: 'to-lifewood-paper' },
    { regex: /from-indigo-500/g, replacement: 'from-lifewood-castletonGreen' },
    { regex: /from-indigo-600/g, replacement: 'from-lifewood-darkSerpent' },
    { regex: /to-purple-500/g, replacement: 'to-lifewood-saffaron' },
    { regex: /from-indigo-50/g, replacement: 'from-lifewood-paper' },
    { regex: /to-purple-50/g, replacement: 'to-lifewood-seaSalt' },
    { regex: /hover:from-blue-100/g, replacement: 'hover:from-lifewood-seaSalt' },
    { regex: /hover:to-indigo-100/g, replacement: 'hover:to-lifewood-paper' },

    // Borders
    { regex: /border-blue-100/g, replacement: 'border-lifewood-castletonGreen/10' },
    { regex: /border-blue-300/g, replacement: 'border-lifewood-saffaron' },
    { regex: /border-indigo-300/g, replacement: 'border-lifewood-castletonGreen/50' },
    { regex: /border-blue-400/g, replacement: 'border-lifewood-saffaron' },
    { regex: /hover:border-blue-400/g, replacement: 'hover:border-lifewood-saffaron' },

    // Shadows
    { regex: /shadow-indigo-500\/40/g, replacement: 'shadow-lifewood-castletonGreen/40' },

    // Others
    { regex: /bg-indigo-200/g, replacement: 'bg-lifewood-saffaron/40' },
    { regex: /bg-purple-200/g, replacement: 'bg-lifewood-earthYellow/40' },
    { regex: /bg-blue-200/g, replacement: 'bg-lifewood-castletonGreen/20' },
    { regex: /bg-purple-50\/80/g, replacement: 'bg-lifewood-saffaron/20' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content;
            for (const { regex, replacement } of replacements) {
                newContent = newContent.replace(regex, replacement);
            }
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(directoryPath);
console.log('Done replacing colors.');
