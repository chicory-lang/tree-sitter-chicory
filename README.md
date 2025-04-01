# tree-sitter-chicory

This repository contains a [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for the Chicory programming language. Tree-sitter is an incremental parsing system that can build a syntax tree for source files and efficiently update the syntax tree as the source file is edited.

## Installation

### Helix

1. Add this to your Helix `languages.toml`:

```toml
[[language]]
name="chicory"
scope="source.chic"
file-types=["chic"]

[[grammar]]
name = "chicory"
source = {git = "https://github.com/chicory-lang/tree-sitter-chicory" , rev="CHANGE ME: target commit hash, probably latest for now"}
```

2. Run `hx -g fetch` to update the grammar
3. Run `hx -g build` to build the grammar
4. Copy the `queries` into `~/.config/helix/runtime/queries/chicory`

### Neovim

1. Add `chicory` to the list of `ensure_installed` languages in your `require('nvim-treesitter.configs').setup` block.

2. Associate `.chic` files with `chicory`:

```lua
vim.filetype.add({
  extension = {
    chic = "chicory", -- Map `.chic` files to the `chicory` filetype
  },
})
```

3. Tell neovim where to find the Chicory parser:

```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.chicory = {
  install_info = {
    url = "https://github.com/chicory-lang/tree-sitter-chicory.git", -- Replace with your grammar repository
    files = { "src/parser.c" },                                      -- Add other files like `src/scanner.c` if needed
    branch = "main",                                                 -- Replace with the appropriate branch
    generate_requires_npm = false,                                   -- Set to true if your grammar requires npm
    requires_generate_from_grammar = false,                          -- Set to true if you need to generate the parser
  },
  filetype = "chicory",                                              -- Associate the parser with your language's filetype
}
```

4. Put/link the queries in the right place (I used a symlink):

```
$ ln -s .config/nvim/queries/chicory $TREE_SITTER_CHICORY/queries
```

Note: You can also point the parser to a local copy of the `tree-sitter-chicory` repo instead of the github url.

For more information, see https://github.com/nvim-treesitter/nvim-treesitter/#adding-parsers

## ANTLR Grammar Implementation Progress

This section tracks the implementation of major language features from the ANTLR grammar.

### Implemented

#### Types

- Primitive types (number, string, boolean, void)
- Tuple types (e.g., `[number, string]`)
- Record types (e.g., `{ x: number, y: number }`)
- Algebraic Data Types (ADTs)
  - Simple variants (e.g., `type Shape = Circle | Square`)
  - Variants with primitive types (e.g., `type Option = None | Some(number)`)
  - Variants with record fields (e.g., `type Result = Ok(string) | Error({ message: string })`)
- Type references (uppercase identifiers)
- Negative numbers (e.g., `-42`, `-3.14`)

#### Expressions

- Match expressions (e.g., `match (value) { Some(x) => x + 1, None => 0 }`)
  - Pattern matching on variants
  - Pattern matching with literals
  - Pattern matching with identifiers
- Binary operations
- Function calls
- Function expressions
  - Regular function expressions (e.g., `(x) => x * 2`)
  - Parenless function expressions (e.g., `x => x * 2`)
- Literals (number, string, boolean)
- Array expressions (e.g., `[1, 2, 3]`, `[]`)
- Identifiers
- Parenthesized expressions
- JSX expressions
  - Self-closing elements (e.g., `<Div />`)
  - Elements with children (e.g., `<Div>Hello world</Div>`)
  - Elements with attributes (e.g., `<Div className="container" count={5} />`)
  - Nested elements
  - Expression children (e.g., `<Div>{count}</Div>`)

#### Statements

- Let assignments (e.g., `let x = 42`)
  - With destructuring patterns (e.g., `let [a, b] = [1, 2]` or `let {x, y} = point`)
- Const declarations (e.g., `const PI = 3.14`)
  - With destructuring patterns (e.g., `const {a, b} = obj` or `const [first, second] = array`)
- Assignment statements
- Import statements
- Export statements

#### Other Features

- Comments (single-line and multi-line)
- Updated match expression syntax

### TODO

The following features from the chicory.g4 grammar are still pending implementation:

- Array type expressions (e.g., `string[]`, `number[][]`)
- Function array types (e.g., `(number => boolean)[]`)
