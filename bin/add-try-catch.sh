#!/bin/bash

set -eu

BIN_DIR=`dirname $0`
if [[ "$OSTYPE" == "darwin"* ]]; then
    BASE_DIR=$( greadlink -m ${BIN_DIR}/../)
else
    BASE_DIR=$( readlink -m ${BIN_DIR}/../)
fi

pushd ${BASE_DIR} >> /dev/null

# Add try ... catch
TMP_JS="build/static/js/tmp.js"
JS_FILES=`find build/static/js/*.js`
for js_file in ${JS_FILES}; do
    echo "try {" > ${TMP_JS}
    cat ${js_file} >> ${TMP_JS}
    echo "" >> ${TMP_JS} # new line is important since the script might end with comment (e.g. the terser compiler does so)
    echo "} catch (e) {alert(e.stack);}" >> ${TMP_JS}
    mv ${TMP_JS} ${js_file}
done

popd >> /dev/null
