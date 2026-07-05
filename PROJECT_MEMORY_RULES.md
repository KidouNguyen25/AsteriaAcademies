# Project Memory Rules

* This project uses projectmem.
* `.projectmem/` is the memory source.
* AI must call/read memory before planning.
* AI must log issues, failed attempts, fixes, decisions, and fragile files.
* AI must not load unrelated project memories unless explicitly requested.

## Session Start Checklist
1. Read projectmem summary.
2. Review active issues.
3. Review recent decisions.
4. Check file warnings before editing.

## Session End Checklist
1. Update memory with what changed.
2. Log what failed or what worked.
3. Log any newly discovered fragile files.
4. Recommend next steps.
