import XCTest
import SwiftTreeSitter
import TreeSitterChicory

final class TreeSitterChicoryTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_chicory())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Chicory grammar")
    }
}
