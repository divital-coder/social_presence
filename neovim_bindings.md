Following are the bindings for AstroNvim, 
1:Enter Visual Mode
shift+v or capital V in esc mode

2:Navigate to the beginng of the file 
gg (type lowercase g 2 times)

3:Navigate to the end of the File
shift + g or capital G 

4: select a part of a file and copy it 
in visual mode, press + and drag and press y to copy

5: For commenting multiple lines of code : 
enter visual mode by "v"
move up/down a few lines then type ":norm i#" for julia or ":norm i//" for C++

6: For uncommenting multiple lines of code:
enter visual mode by "v"

move up/down a few lines then type ":s/^#\s*//" for julia or ":s/^\/\///" for C++ or ":s/^--//" for comments beginning with --
