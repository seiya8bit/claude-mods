# claude-mods

Claude Code mods (plugins of function hooks), published as a plugin marketplace.

```
/plugin marketplace add seiya8bit/claude-mods
/plugin install usage-status@claude-mods
```

| Mod | What it does |
| --- | --- |
| [usage-status](plugins/usage-status) | Shows `5h 2% 1w 5% ↻10/10` at the right of the prompt footer; turns amber at 70% and red at 90%, and adds the 5h reset time near the limit |

## Adding a mod

1. Put it in `plugins/<name>/` (`.claude-plugin/plugin.json`, `hooks/hooks.json`, `hooks/register.tsx`).
2. Add it to `.claude-plugin/marketplace.json` and the table above.
3. `claude plugin validate plugins/<name>` and `claude plugin validate .`
