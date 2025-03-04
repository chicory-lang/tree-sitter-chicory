; Keywords
["const" "let"] @keyword.storage
"type" @keyword.storage.type
"if" @keyword.control.conditional
"else" @keyword.control.conditional
"match" @keyword.control.conditional
"import" @keyword.control.import
"export" @keyword.control.import
"from" @keyword.control.import

; Types
(primitive_type) @type
(type_identifier) @type
(tuple_type
  "[" @punctuation.bracket
  "]" @punctuation.bracket)
(record_type
  "{" @punctuation.bracket
  "}" @punctuation.bracket)

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

; Functions
(function_expression) @function
(parameter_list
  (identifier) @variable.parameter)
(call_expression
  function: (identifier) @function)

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

; Punctuation
["(" ")" "[" "]" "{" "}"] @punctuation.bracket
["=>"] @punctuation
["," ] @punctuation
["|" (wildcard) ] @operator

; Comments
(comment) @comment