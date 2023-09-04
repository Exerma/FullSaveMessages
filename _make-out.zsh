#/bin/zsh
trash=.trash
superSource=.
superTarget=dist

manifest=manifest.json
images=images
dependancies=dependancies

projectSource=src
projectTarget=files

# Prepare folders
cd $(dirname "$0")
rm -Rf $superTarget
mkdir $superTarget

#-----------------------------------------------------------------------------
# Copy files of the project into distribution folder
#-----------------------------------------------------------------------------
source=$superSource
target=$superTarget

# Copy supplementary files
cp    $source/$manifest  $target/$manifest
cp -r $source/$images    $target/$images

# Copy only js files of dependancies
mkdir $target/$dependancies
find $dependancies -name "*.js" | cpio -pdm $target

# Compile files
tsc --project tsconfig.json

# Copy compiled JS files into the distribution folder
source=$superSource/$projectSource
target=$superTarget
mkdir $target
find $source -name "*.js"   | cpio -pdm $target
find $source -name "*.html" | cpio -pdm $target
find $source -name "*.css"  | cpio -pdm $target

mv $target/$projectSource $target/$projectTarget


# Add missing ".js" extension to import instructions
# template is: 'import [...] "anything"'  --> 'import [...] "anything.js"'
find $target -name "*.js" -exec  sed -r -i '' 's/^(\s*import[^"]+"[^"]*)(")(;?\s*)$/\1.js"\3/gi' {} \;

# # Replace "src" by "files" in import instructions
# find $target -name "*.js" -exec  sed -r -i '' "s%^(\s*import[^\"]+\"[^\"]*)(/$source/)([^\"]*\";\s*)$%\1/$final/\3%gi" {} \;

# Replace ".ts" file extension by ".js" in manifest
source=$projectSource
target=$projectTarget
sed -r -i '' -e "s%/$projectSource/%/$projectTarget/%g" -e 's/\.ts/\.js/gi' $superTarget/$manifest

# Make bundled target files



#-----------------------------------------------------------------------------
# Clean project
#-----------------------------------------------------------------------------
./_clean.zsh
