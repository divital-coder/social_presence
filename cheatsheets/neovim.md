# Neovim Cheatsheet

Bindings for AstroNvim.

| Action | Keys / Command |
|--------|----------------|
| Enter Visual mode | `Shift+v` (or capital `V`) in normal mode |
| Go to beginning of file | `gg` (lowercase g twice) |
| Go to end of file | `Shift+g` (capital `G`) |
| Select and copy part of a file | In Visual mode, press `+`, drag, then `y` to copy |
| Comment multiple lines | Enter Visual mode with `v`, move up/down, then `:norm i#` (Julia) or `:norm i//` (C++) |
| Uncomment multiple lines | Enter Visual mode with `v`, move up/down, then `:s/^#\s*//` (Julia), `:s/^\/\///` (C++), or `:s/^--//` (comments starting with `--`) |
