#!/usr/bin/env python3

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
errors = []

def load(filename):
    path = ROOT / filename

    if not path.is_file():
        errors.append(f"Missing required file: {filename}")
        return ""

    text = path.read_text(encoding="utf-8")

    if len(text.strip()) < 100:
        errors.append(f"File appears empty or damaged: {filename}")

    return text

def require(filename, text, variants, description):
    if not any(variant in text for variant in variants):
        errors.append(f"{filename}: missing {description}")

home = load("home.html")
settings = load("settings.html")
health = load("health-dashboard-v4.html")
assessments = load("assessments.html")
functional_intro = load("functional-age-intro.html")
functional_test = load("test.html")
body_assessments = load("visual.html")
journal = load("journal.html")
reset = load("reset.html")

# Home Screen: рабочие точки входа.
require(
    "home.html",
    home,
    [
        "window.location.href='settings.html'",
        'window.location.href="settings.html"'
    ],
    "working Settings gear route"
)

require(
    "home.html",
    home,
    ["health-dashboard-v4.html"],
    "Health Snapshot route"
)

require(
    "home.html",
    home,
    ["assessments.html"],
    "Assessments route"
)

require(
    "home.html",
    home,
    ["journal.html"],
    "Journal route"
)

require(
    "home.html",
    home,
    ["reset.html"],
    "Reset Break route"
)

# Settings.
require(
    "settings.html",
    settings,
    ["width: min(100%, 430px);"],
    "430px mobile layout"
)

require(
    "settings.html",
    settings,
    [
        'window.location.href = "home.html"',
        "history.back()"
    ],
    "Home return behavior"
)

# Health Snapshot.
require(
    "health-dashboard-v4.html",
    health,
    [
        'href="home.html"',
        "window.location.href='home.html'",
        'window.location.href="home.html"'
    ],
    "Home return route"
)

# Assessments selection.
require(
    "assessments.html",
    assessments,
    ["functional-age-intro.html"],
    "Functional Age entry"
)

require(
    "assessments.html",
    assessments,
    ['href="visual.html"', "visual.html"],
    "Body Assessments entry"
)

require(
    "assessments.html",
    assessments,
    ['href="home.html"', "home.html"],
    "Home return route"
)

# Functional Age.
require(
    "functional-age-intro.html",
    functional_intro,
    ["test.html?functionalStart=1"],
    "Functional Age test start"
)

require(
    "functional-age-intro.html",
    functional_intro,
    ["assessments.html"],
    "Assessments return route"
)

require(
    "test.html",
    functional_test,
    ["functionalStart"],
    "external Functional Age start bridge"
)

# Body Assessments.
require(
    "visual.html",
    body_assessments,
    ["assessments.html"],
    "Assessments return route"
)

if errors:
    print("\nMOVESPAN CORE CHECK FAILED\n")

    for error in errors:
        print(f"  - {error}")

    print("\nCommit blocked: restore the working route or update the check deliberately.\n")
    sys.exit(1)

print("MoveSpan core check passed:")
print("  Home Screen")
print("  Settings")
print("  Health Snapshot")
print("  Assessments")
print("  Functional Age")
print("  Body Assessments")
print("  Journal")
print("  Reset Break")
