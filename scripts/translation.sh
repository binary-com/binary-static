#!/bin/sh

DIR=$(cd "$(dirname "$0")"; pwd)
cd "$DIR"
echo "make translation under $DIR\n";

carton exec perl local/bin/xgettext.pl  --verbose -P perl=pl,pm -P tt2=tt,tt2  \
    --output=messages.pot   --output-dir=../src/translations/   --directory=../src/templates/  --directory=bin/

PATH=/usr/local/opt/gettext/bin/:$PATH

carton exec perl -Ilib -Ibin bin/extra_translations.pl

msgmerge --previous --backup none --no-wrap --update ../src/translations/en.po ../src/translations/messages.pot

carton exec perl -pi -e 's/Content-Type: text\/plain; charset=CHARSET/Content-Type: text\/plain; charset=UTF-8/'  ../src/translations/messages.pot


carton exec perl -ni -e  'print unless m/(^#:|^#\.)/'  ../src/translations/en.po

for i in $(ls ../src/translations/*.po*); do \
    carton exec perl -ni -e  'print unless m/(^#:|^#\.)/'  $i ; \
done
