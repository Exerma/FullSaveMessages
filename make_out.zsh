#/bin/zsh
trash=.trash
mainTarget=out
final=files
manifest=manifest.json
images=images

# Prepare folders
cd $(dirname "$0")
rm -r $mainTarget
mkdir $mainTarget

#-----------------------------------------------------------------------------
# Main files of the project
#-----------------------------------------------------------------------------
source=src
target=$mainTarget

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

# Finalisation
mv $target/$source $target/$final
find $source -name "*.js" -exec mv {} $trash \;


#-----------------------------------------------------------------------------
# node_modules
#-----------------------------------------------------------------------------
# Copy all ".js" files from node modules
nodemodules=node_modules
mkdir $mainTarget/$nodemodules

# Copy files from "node_modules" into the "out/node_modules" folder
find $nodemodules -name "*.js"  | cpio -pdm $mainTarget/$nodemodules


#-----------------------------------------------------------------------------
# Dependancies
#-----------------------------------------------------------------------------
dependancies=dependancies
mkdir $mainTarget/$dependancies

# Dependancies: NativeFileSystem
module=native-file-system-adapter-master

mkdir $mainTarget/$dependancies/$module
cp -R ./$dependancies/$module/$final $mainTarget/$dependancies/$module/

# Dependancies: jsPDF
module=jspdf
mkdir $mainTarget/$dependancies/$module
cp -R ./$dependancies/$module/$final $mainTarget/$dependancies/$module/

# Force leading "." in path declared by import instructions and add ".js" extension
find $mainTarget/$dependancies -name "*.js" -exec  sed -r -i '' "s%^(\s*import[^\"']+[\"'])([^\.][^\"']*)([\"'];\s*)$%\1/node_modules/\2\3%gi" {} \;
