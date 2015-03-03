#!/bin/sh

dirs='src/yahttp .'

do_gen() {
  cd $1
  aclocal -Im4
  autoheader
  autoconf
  automake -ac
}

for dir in $dirs; do
  do_gen $dir
done
