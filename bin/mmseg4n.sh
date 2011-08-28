#!/usr/bin/env bash
set -e

if [ $# -lt 2 ]; then
    echo "Usage: mmseg4n DIC_DIR SERVICE_HOST SERVICE_PORT" 1>&2
    exit 1
fi

# validate environment
echo "Validating environment..."

for BIN in node; do
    which $BIN >/dev/null || {
        echo "requires $BIN in PATH" 1>&2;
        exit 1;
    }
done

echo "Environment OK"

# define global constants
export DIC_DIR="$(cd "$1" && pwd)"
export SERVICE_HOST="$2"
export SERVICE_PORT="$3"
export MMSEG4N_HOME="$(cd $(dirname "$1") && pwd)"

[ "$SERVICE_HOST" == "" ] && export SERVICE_HOST="127.0.0.1"
[ "$SERVICE_PORT" == "" ] && export SERVICE_PORT="8085"

pushd "$MMSEG4N_HOME" >/dev/null
    # start web interface
    /usr/bin/env node src/main.js \
            --dic-dir="$DIC_DIR" \
            --host="$SERVICE_HOST" \
            --port="$SERVICE_PORT"
popd