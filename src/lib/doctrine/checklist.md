# Quality Checklist

The Plan Reviewer uses this checklist to challenge the Planner's work. Every item must pass before the plan is approved.

## Completeness
- [ ] Every file in the file structure is included in the plan
- [ ] Every file has complete, working code
- [ ] No placeholders: no "TODO", "implement later", "// add code here"
- [ ] No fake imports: every import resolves to a real package or file
- [ ] Config files included (package.json, tsconfig, etc.)
- [ ] Dependencies listed with specific versions

## Code Quality
- [ ] TypeScript strict mode compatible
- [ ] No `any` types unless absolutely necessary (and justified)
- [ ] Error handling in every async operation
- [ ] Loading and error states for all UI components
- [ ] Responsive design considered
- [ ] Accessibility basics (aria labels, semantic HTML)

## Architecture
- [ ] Clear separation of concerns
- [ ] No circular dependencies
- [ ] State management strategy defined
- [ ] API layer properly abstracted
- [ ] Environment variables documented

## Testing
- [ ] Test strategy defined
- [ ] Critical paths have test coverage plan
- [ ] Edge cases identified

## Reviewer Questions
When the Reviewer finds gaps, they send structured questions:
```
Q: [specific question about the gap]
Context: [which file/section has the problem]
Expected: [what should be there instead]
```

The Planner must answer each question and update the plan before re-submission.

## Approval Criteria
The plan is approved when:
1. All checklist items pass
2. All reviewer questions are resolved
3. The Coder could build the entire project without asking a single question
4. The Tester has clear specs to verify against
