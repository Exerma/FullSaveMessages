#/bin/zsh
cd $(dirname "$0")

# Files of native-file-system-adapter-master
source=../../_Dependancies/native-file-system-adapter-master/native-file-system-adapter-master
target=./dependancies/native-file-system-adapter-master
mkdir $target
rm -R $target/*
cp -R $source/dist $target/files
cp -R $source/types/src $target/src


# TypeScript prototypes of Thunderbird
source=../../_Dependancies/generate-mail-extension-typings/generate-mail-extension-typings
target=./dependancies/generate-mail-extension-typings
cp $source/out/index.d.ts $target/src/thunderbird.d.ts
