#/bin/zsh
source=src
target=out
final=files
manifest=manifest.json
images=images

# Prepare folders
cd $(dirname "$0")
rm -r $target
mkdir $target

# Copy files from "src" to "out" folder
cp ./$manifest  $target/$manifest
find $source -name "*.js"   | cpio -pdm $target
find $source -name "*.html" | cpio -pdm $target
find $source -name "*.css"  | cpio -pdm $target
cp -r $images    $target/$images

# Add missing ".js" extension to import instructions
find $target -name "*.js" -exec  sed -r -i '' 's/^(\s*import[^"]+"[^"]*)(")(;\s*)$/\1.js"\3/gi' {} \;
sed -r -i '' -e "s/$source/$final/g" -e 's/\.ts"/.js/gi' $target/$manifest

# Finalisation
mv $target/$source $target/$final
