cp index.html public/index.html
$(sed -i '' 's#./public/main.js#./main.js#g' public/index.html)
