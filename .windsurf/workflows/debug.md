---
description: Diagnose and fix a bug using the structured debug workflow
---

# Debug Workflow

When the user reports an issue using the format below, follow these steps:

## Input Format

The user will provide:
```
Issue: [Describe issue]
Problem: [What happens when you test it]
Expected: [What should happen]
Actual: [What's actually happening]
```

## Steps

1. **Acknowledge and parse** the issue report into the four fields (Issue, Problem, Expected, Actual).

2. **Create or update `debugplan.md`** in the project root with the issue details, diagnosis, and fix plan. Use the template defined in that file.

3. **Diagnose the root cause:**
   - Search the codebase for related files and functions
   - Read the relevant code sections
   - Check backend logs if applicable (Flask server output)
   - Check frontend console errors if a screenshot is provided
   - Identify the root cause — not just the symptom

4. **Update `debugplan.md`** with:
   - Root cause explanation
   - Files affected
   - Proposed fix (before implementing)

5. **Implement the fix:**
   - Make minimal, targeted changes
   - Prefer upstream fixes over downstream workarounds
   - Do not break existing functionality

6. **Verify the fix:**
   - Run `npx tsc --noEmit` to confirm no TypeScript errors
   - If backend changes, run `python test_api.py` to confirm API tests pass
   - Describe how the user can manually verify

7. **Update `debugplan.md`** with:
   - Status: RESOLVED
   - What was changed and why
   - How to verify

8. **Update `progress.md`** if the fix is significant enough to track.
