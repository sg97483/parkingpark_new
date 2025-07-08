// deleteEmptyStyles.js
const fs = require('fs');
const path = require('path');

const targetExtensions = ['.js', '.jsx', '.ts', '.tsx'];
const targetPattern = /const\s+styles\s*=\s*StyleSheet\.create\(\s*\{\s*\}\s*\);?/g;

function searchAndClean(dirPath) {
  const entries = fs.readdirSync(dirPath, {withFileTypes: true});

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      searchAndClean(fullPath);
    } else if (targetExtensions.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8');

      if (targetPattern.test(content)) {
        const newContent = content.replace(targetPattern, '');
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`✅ Removed empty styles from: ${fullPath}`);
      }
    }
  }
}

const projectRoot = path.resolve(__dirname, 'src'); // src 폴더 기준
searchAndClean(projectRoot);
