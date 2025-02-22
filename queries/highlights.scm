; Keywords
"type" @keyword
"let" @keyword
"const" @keyword

; Types
(primitive_type) @type
(type_identifier) @type

; Variables and Fields
(identifier) @variable
(record_field
  name: (identifier) @property)
(adt_field
  name: (identifier) @property)

; Literals
(string_literal) @string
(number) @number

; Comments
(comment) @comment
