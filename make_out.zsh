#/bin/zsh
trash=.trash
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
# Replace "src" by "files" in import instructions
find $target -name "*.js" -exec  sed -r -i '' "s%^(\s*import[^\"]+\"[^\"]*)(/$source/)([^\"]*\";\s*)$%\1/$final/\3%gi" {} \;
# Replace ".ts" file extension by ".js" in manifest
sed -r -i '' -e "s/$source/$final/g" -e 's/\.ts/.js/gi' $target/$manifest

# Dependancies
mkdir $target/dependancies
mkdir $target/dependancies/native-file-system-adapter-master
cp -R ./dependancies/native-file-system-adapter-master/files $target/dependancies/native-file-system-adapter-master/

# Finalisation
mv $target/$source $target/$final
find $source -name "*.js" -exec mv {} $trash \;
