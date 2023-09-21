#/bin/zsh
trash=.trash

# Prepare folders
cd $(dirname "$0")
mkdir $trash

#-----------------------------------------------------------------------------
# Main files of the project
#-----------------------------------------------------------------------------
source=src

# Remove local .js files created by "tsc-p tsconfig.json" compiler
find $source -name "*.js" -exec mv {} $trash \;


