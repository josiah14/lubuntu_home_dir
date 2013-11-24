#!/bin/bash

echo "Making Safari extension..."

rm -rf ../Feeder.safariextension
mkdir ../Feeder.safariextension

git ls-files | zip -@ ../Feeder.safariextension/f.zip 1> /dev/null
cd ../Feeder.safariextension
unzip f.zip > /dev/null
rm f.zip
cd - > /dev/null

echo "... Done"
