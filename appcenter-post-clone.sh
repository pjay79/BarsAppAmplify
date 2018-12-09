#!/usr/bin/env bash

mkdir tmp
cd tmp
git clone https://github.com/pjay79/BarsAppAmplify-aws.git .
cd ..
cp /tmp/aws-exports.js .
rm -rf tmp