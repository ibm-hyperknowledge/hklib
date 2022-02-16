echo "Prepending copyright notice to files in ./types..."
for f in $(find ./dist -type f -name "*.d.ts")
do 
  echo "/**\n* Copyright (c) 2016-present, IBM Research\n* Licensed under The MIT License [see LICENSE for details]\n*/\n$(cat $f)" > $f
done 
echo "Done!"
