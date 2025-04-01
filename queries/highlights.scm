; Keywords
["const" "let"] @keyword.storage
"type" @keyword.storage.type
"if" @keyword.control.conditional
"else" @keyword.control.conditional
"match" @keyword.control.conditional
"import" @keyword.control.import
"export" @keyword.control.import
"from" @keyword.control.import
"bind" @keyword.control.import
"as" @keyword.control.import

; Types
(primitive_type) @type
(type_identifier) @type
(function_type
  "(" @punctuation.bracket
  ")" @punctuation.bracket
  "=>" @punctuation)
(parameter_list_type) @type
(named_type_param
  name: (identifier) @variable.parameter
  ":" @punctuation
  type: (_) @type)
(tuple_type
  "[" @punctuation.bracket
  "]" @punctuation.bracket)
(record_type
  "{" @punctuation.bracket
  "}" @punctuation.bracket)
(generic_type
  "<" @punctuation.bracket
  ">" @punctuation.bracket)
(type_parameters
  "<" @punctuation.bracket
  ">" @punctuation.bracket)

; Variables and Fields
(record_field
  name: (identifier) @property)
(record_field_expression
  name: (identifier) @property)
(record_field_expression
  value: (identifier) @variable)
(adt_field
  name: (identifier) @property)

; Match Patterns
(match_pattern
  (identifier) @constructor)  ; ADT constructors
(match_pattern
  (wildcard) @constant)       ; Wildcard _

; Literals
(string_literal) @string
(number) @constant.numeric
["true" "false"] @constant.builtin.boolean

; Arrays and Records
(array_expression
  "[" @punctuation.bracket
  "]" @punctuation.bracket)
(record_expression
  "{" @punctuation.bracket
  "}" @punctuation.bracket)
(index_expression
  "[" @punctuation.bracket
  "]" @punctuation.bracket)
(array_destructuring_pattern
  "[" @punctuation.bracket
  "]" @punctuation.bracket)
(record_destructuring_pattern
  "{" @punctuation.bracket
  "}" @punctuation.bracket)

; Functions
(function_expression) @function
(parameter_list
  (identifier) @variable.parameter)
(call_expression
  function: (identifier) @function)
(call_expression
  function: (member_expression) @function)
(member_expression
  object: (identifier) @variable
  property: (identifier) @property)

; JSX - More specific patterns first
[
  "<"
  ">"
  "</"
  "/>"
] @punctuation.bracket

(jsx_opening_element
  name: (identifier) @tag)
(jsx_closing_element
  name: (identifier) @tag)
(jsx_self_closing_element
  name: (identifier) @tag)
(jsx_attribute
  (identifier) @attribute)
(jsx_text) @string

; Variables - ensure this comes AFTER the JSX rules
(identifier) @variable

; Types
(type_identifier) @type
(primitive_type) @type

; Match Patterns
(match_pattern
  . (identifier) @type)  ; BareAdtMatchPattern
(match_pattern 
  . (identifier) @type  ; AdtWithParamMatchPattern
  (identifier) @variable.parameter)  ; Parameter

; Imports
(binding_identifier
  name: (identifier) @variable
  type: (_) @type)
(binding_import
  "{" @punctuation.bracket
  "}" @punctuation.bracket)

; Punctuation
["(" ")" "[" "]" "{" "}"] @punctuation.bracket
["=>"] @punctuation
["," ] @punctuation
["|" (wildcard) ] @operator

; Operators
(operation_expression
  operator: _ @operator)

; Comments
(comment) @comment