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

## ANTLR Grammar Implementation Progress

This section tracks the implementation of major language features from the ANTLR grammar.

### Implemented

#### Types
- Primitive types (number, string, boolean)
- Tuple types (e.g., `[number, string]`)
- Record types (e.g., `{ x: number, y: number }`)
- Algebraic Data Types (ADTs)
  - Simple variants (e.g., `type Shape = Circle | Square`)
  - Variants with primitive types (e.g., `type Option = None | Some(number)`)
  - Variants with record fields (e.g., `type Result = Ok(string) | Error({ message: string })`)
- Type references (uppercase identifiers)

#### Statements
- Let assignments (e.g., `let x = 42`)
- Const declarations (e.g., `const PI = 3.14`)

### To Be Implemented

#### Expressions and Statements
- Assignment statements (other than let/const)
- Import statements
- Export statements
- Function calls
- Binary operations
- Unary operations
- Literals (number, string, boolean)
- Identifiers
- Parenthesized expressions

#### Other Features
- Comments (single-line and multi-line)
- Whitespace handling
- Error recovery
