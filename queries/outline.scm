; Type Definitions
(type_definition
  name: (type_identifier) @name) @item

; JSX Components - More specific patterns first
(const_declaration
  name: (identifier) @name
  value: (jsx_element)) @item
(let_assignment
  name: (identifier) @name
  value: (jsx_element)) @item

; Constants with Function Expressions
(const_declaration
  name: (identifier) @name
  value: (function_expression)) @item

; Constants with Match Expressions
(const_declaration
  name: (identifier) @name
  value: (match_expression)) @item

; Constants with Array Expressions
(const_declaration
  name: (identifier) @name
  value: (array_expression)) @item

; Constants with Record Expressions
(const_declaration
  name: (identifier) @name
  value: (record_expression)) @item

; Other Constants
(const_declaration
  name: (identifier) @name) @item

; Let Assignments with Function Expressions
(let_assignment
  name: (identifier) @name
  value: (function_expression)) @item

; Let Assignments with Match Expressions
(let_assignment
  name: (identifier) @name
  value: (match_expression)) @item

; Let Assignments with Array Expressions
(let_assignment
  name: (identifier) @name
  value: (array_expression)) @item

; Let Assignments with Record Expressions
(let_assignment
  name: (identifier) @name
  value: (record_expression)) @item

; Other Let Assignments
(let_assignment
  name: (identifier) @name) @item

; Imports and Exports
(import_statement) @item
(export_statement) @item
