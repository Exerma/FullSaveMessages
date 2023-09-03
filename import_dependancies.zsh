#/bin/zsh
cd $(dirname "$0")


# Default folders
superSource=../../_Dependancies
superTarget=./dependancies


# Clean previous dependancies
rm -R $superTarget
mkdir $superTarget


# Files of native-file-system-adapter-master
folder=native-file-system-adapter-master
source=$superSource/$folder/$folder
target=$superTarget/$folder
mkdir $target
rm -R $target/*
cp -R $source/dist $target/files
cp -R $source/types/src $target/src


# TypeScript prototypes of Thunderbird
folder=generate-mail-extension-typings
source=$superSource/$folder/$folder
target=$superTarget/$folder
mkdir $target
mkdir $target/src
cp $source/out/index.d.ts $target/src/thunderbird.d.ts


# # Addon developer support: ResourceUrl
# # https://github.com/thundernest/addon-developer-support/tree/master/auxiliary-apis
# folder=ResourceUrl
# source=$superSource/addon-developer-support/auxiliary-apis/$folder
# target=.$superTarget/$folder
# mkdir $target
# mkdir $target/files
# mkdir $target/src
# cp $source/schema.json $target
# cp $source/implementation.json $target/files/resourceUrl.js
# cat >$target/src/resourceUrl.d.ts <<EOF
#     declare namespace ResourceUrl {
#         function register(
#             namespace: string,
#             folder: string
#         ) : Promise<void>;
#     }
# EOF


# jsPDF
# Source: https://github.com/parallax/jsPDF
folder=jspdf
source=$superSource/$folder/$folder
target=$superTarget/$folder
mkdir $target
mkdir $target/src
mkdir $target/files
cp $source/types/index.d.ts $target/src/jspdf.d.ts
cp $source/dist/jspdf.es.js $target/files/jspdf.js
