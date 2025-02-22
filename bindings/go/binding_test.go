package tree_sitter_chicory_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_chicory "github.com/chicory-lang/tree-sitter-chicory/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_chicory.Language())
	if language == nil {
		t.Errorf("Error loading Chicory grammar")
	}
}
