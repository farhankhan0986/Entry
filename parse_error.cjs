const fs = require('fs');
const html = fs.readFileSync('temp.html', 'utf8');

// The error message is usually within <title> or <h1 data-nextjs-dialog-header> or encoded in __next_errors
const titleMatch = html.match(/<title>(.*?)<\/title>/);
if (titleMatch) console.log("Title: " + titleMatch[1]);

// Let's print out the first script to see what it is passing down
const scripts = html.match(/<script>(.*?)<\/script>/g);
if (scripts) {
   // Just grab the first 1000 chars of scripts to avoid console spam
   console.log("Scripts excerpt:");
   console.log(scripts.join('\n').substring(0, 1000));
}

// Or Next.js 500 error in plain text?
if (html.includes("TypeError")) console.log("TypeError found");
if (html.includes("ReferenceError")) console.log("ReferenceError found");

// Regex to pull next.js error overlay text
const errorMatch = html.match(/"message":"([^"]+)"/);
if (errorMatch) {
  console.log("Next JS Error Message:", errorMatch[1]);
} else {
  // Check for any text inside <h1>
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (h1Match) console.log("H1:", h1Match[1]);
}
