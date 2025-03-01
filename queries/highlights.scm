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

; Variables and Fields
(record_field
  name: (identifier) @property)
(adt_field
  name: (identifier) @property)

; Match Patterns
(match_pattern
  (identifier) @constructor)  ; ADT constructors
(match_pattern
  (wildcard) @constant)       ; Wildcard _

; Literals
(string_literal) @string
[(literal) (number)] @constant.numeric
["true" "false"] @constant.builtin.boolean

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