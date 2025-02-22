; Keywords
"type" @keyword
"let" @keyword
"const" @keyword
"match" @keyword
"import" @keyword
"export" @keyword
"from" @keyword
"if" @keyword
"else" @keyword

; Types
(primitive_type) @type
(type_identifier) @type

; Variables and Fields
(identifier) @variable
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
(number) @number
"true" @constant
"false" @constant

; Comments
(comment) @comment
