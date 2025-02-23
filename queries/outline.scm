;; Type Definitions
(type_definition
  name: (type_identifier) @name) @item

;; Constants with Function Expressions
(const_declaration
  name: (identifier) @name
  value: (function_expression)) @item

;; Constants with Match Expressions
(const_declaration
  name: (identifier) @name
  value: (match_expression)) @item


;; Other Constants
(const_declaration
  name: (identifier) @name) @item

;; Let Assignments with Function Expressions
(let_assignment
  name: (identifier) @name
  value: (function_expression)) @item

;; Let Assignments with Match Expressions
(let_assignment
  name: (identifier) @name
  value: (match_expression)) @item


;; Other Let Assignments
(let_assignment
  name: (identifier) @name) @item

;; Imports and Exports
(import_statement) @item
(export_statement) @item
