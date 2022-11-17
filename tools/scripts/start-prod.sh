#!/bin/sh
if [ -f "$DOTENV_PATH" ]; then
  export $(cat $DOTENV_PATH | grep "^[^#\;]" | xargs)
fi  
node main.js