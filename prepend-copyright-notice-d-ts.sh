echo "Prepending copyright notice to files in ./types..."
for f in $(find ./dist -type f -name "*.d.ts")
do 
  echo "
/**
* Copyright (c) 2016-present, IBM Research
* Licensed under The MIT License [see LICENSE for details]
*/
$(cat $f)" > $f
done 
echo "Done!"
