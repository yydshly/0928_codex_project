"""Build a name-and-source index from two pinned upstream README files.

Usage: python tools/build_inventory.py ../../a-upstream.tmp ../../b-upstream.tmp
The downloaded README files are temporary inputs; only the extracted index is kept.
Descriptions are intentionally omitted. The website's Chinese effect summaries are
written separately and should not be inferred from an upstream tool name alone.
"""

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
BASES = {
    "A": "https://github.com/jivoi/awesome-osint/blob/3ab9cde5d0f638de91bc86147db6996472d927c6/README.md",
    "B": "https://github.com/rawfilejson/awesome-osint-arsenal/blob/2c6475a1d5b941cc598b3612419ef22e6d903ce8/README.md",
}
LINK = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")


def clean(text):
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"[*_`]+", "", text)
    return re.sub(r"\s+", " ", text).strip(" |:-")


def normalize_url(url):
    return url.rstrip(".,;")


def parse_a(path):
    result = []
    section = ""
    subsection = ""
    active = False
    for line_no, line in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
        heading = re.match(r"^## (?:\[↑\]\([^)]*\) )?(.+)$", line)
        if heading:
            section = clean(heading.group(1))
            subsection = ""
            if section == "General Search":
                active = True
            if section == "License":
                active = False
            continue
        sub = re.match(r"^### (?:\[↑\]\([^)]*\) )?(.+)$", line)
        if sub:
            subsection = clean(sub.group(1))
            continue
        if not active or not re.match(r"^\s*[*-]\s+", line):
            continue
        match = LINK.search(line)
        if not match:
            continue
        name, url = clean(match.group(1)), normalize_url(match.group(2))
        if not name or not url.startswith(("https://", "http://")):
            continue
        result.append({
            "name": name,
            "url": url,
            "section": f"{section} / {subsection}" if subsection else section,
            "source": "A",
            "sourceUrl": f"{BASES['A']}#L{line_no}",
        })
    return result


def parse_b(path):
    result = []
    section = ""
    for line_no, line in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
        heading = re.match(r"^## (\d+)\.\s+(.+)$", line)
        if heading:
            section = f"{int(heading.group(1)):02d} · {clean(heading.group(2))}"
            continue
        if not section or not line.startswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) < 2 or re.fullmatch(r"[:\- ]+", cells[0]):
            continue
        name = clean(cells[0])
        if not name or name.lower() in {
            "tool", "platform", "os", "api", "resource", "name", "service",
            "script", "category", "source", "site", "engine", "framework",
            "type", "feature", "method", "command", "utility", "project",
            "tool / service", "tool / platform", "repo", "dataset", "channel",
        }:
            continue
        # Skip prose/command rows in non-resource comparison tables.
        if len(name) > 90 or name.startswith(("#", "$")):
            continue
        match = LINK.search(line)
        url = normalize_url(match.group(2)) if match else ""
        if not url:
            bare = re.search(r"https?://[^\s`|<>]+", line)
            url = normalize_url(bare.group(0)) if bare else ""
        result.append({
            "name": name,
            "url": url,
            "section": section,
            "source": "B",
            "sourceUrl": f"{BASES['B']}#L{line_no}",
        })
    return result


def main():
    if len(sys.argv) != 3:
        raise SystemExit("usage: python tools/build_inventory.py A_README B_README")
    items = parse_a(Path(sys.argv[1])) + parse_b(Path(sys.argv[2]))
    # Exact duplicate rows within the same upstream section do not add value.
    seen = set()
    unique = []
    for item in items:
        key = (item["source"], item["section"], item["name"].casefold(), item["url"])
        if key not in seen:
            seen.add(key)
            unique.append(item)
    output = HERE / "inventory.js"
    payload = json.dumps(unique, ensure_ascii=False, separators=(",", ":"))
    output.write_text("window.OSINT_INVENTORY=" + payload + ";\n", encoding="utf-8")
    print(f"Wrote {len(unique)} entries to {output.name}")
    for source in ("A", "B"):
        group = [item for item in unique if item["source"] == source]
        print(f"{source}: {len(group)} rows, {len(set(item['section'] for item in group))} sections")


if __name__ == "__main__":
    main()
