"""
SKCP Labour Weekly Salary Chart Generator
==========================================
Generates a monthly labour attendance & salary calendar (PNG) in English
and/or Kannada, styled with an Atlassian-inspired color palette.

HOW TO USE
----------
1. Edit the CONFIG section below (name, month, year, daily wage, absent days).
2. Run:  python3 salary_chart_generator.py
3. Output PNG(s) are saved next to this script.

Requirements: matplotlib, and a Kannada-capable font if generating Kannada
output (this script auto-installs "Noto Sans Kannada" if not already present
at /usr/share/fonts/truetype/noto/ — on your own machine, install it via:
    Ubuntu/Debian: sudo apt-get install fonts-noto-core
    Or download:   https://fonts.google.com/noto/specimen/Noto+Sans+Kannada
"""

import os
import calendar
import argparse
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from matplotlib.font_manager import FontProperties, fontManager

# ============================================================
# CONFIG  -- edit these values for each labourer / month
# ============================================================
LABOUR_NAME_EN = "Ramesh"          # Labour name (English)
LABOUR_NAME_KN = "ರಮೇಶ್"           # Labour name (Kannada) - translate/transliterate as needed
YEAR           = 2026
MONTH          = 7                 # 1-12
DAILY_WAGE     = 400                # Rs. per present day
HOLIDAY_WEEKDAY = 6                 # 0=Mon .. 6=Sun (Python's calendar.weekday convention: Mon=0)
                                     # Default 6 = Sunday is the factory holiday

# Mark specific dates as ABSENT (list of day numbers in the month, e.g. [10, 21])
ABSENT_DATES = []                   # e.g. ABSENT_DATES = [10, 17, 24]

LANGUAGES_TO_GENERATE = ["en", "kn"]   # choose any of: "en", "kn"
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ============================================================
# Fonts (Kannada fallback-safe)
# ============================================================
KN_FONT_REG = "/usr/share/fonts/truetype/noto/NotoSansKannada-Regular.ttf"
KN_FONT_BOLD = "/usr/share/fonts/truetype/noto/NotoSansKannada-Bold.ttf"
if os.path.exists(KN_FONT_REG):
    fontManager.addfont(KN_FONT_REG)
if os.path.exists(KN_FONT_BOLD):
    fontManager.addfont(KN_FONT_BOLD)
matplotlib.rcParams["font.family"] = ["Noto Sans Kannada", "DejaVu Sans"]

# ============================================================
# Atlassian-inspired palette
# ============================================================
COL_HEADER_BG   = "#0052CC"
COL_HEADER_TEXT = "#FFFFFF"
COL_DAYROW_BG   = "#253858"
COL_PRESENT_BG, COL_PRESENT_BR, COL_PRESENT_TX = "#E3FCEF", "#36B37E", "#006644"
COL_ABSENT_BG,  COL_ABSENT_BR,  COL_ABSENT_TX  = "#FFEBE6", "#DE350B", "#BF2600"
COL_HOLIDAY_BG, COL_HOLIDAY_BR, COL_HOLIDAY_TX = "#FFF0B3", "#FF991F", "#974F0C"
COL_OUTMONTH_BG, COL_OUTMONTH_BR, COL_OUTMONTH_TX = "#F4F5F7", "#DFE1E6", "#B3BAC5"
COL_TOTAL_BG, COL_TOTAL_BR, COL_TOTAL_TX = "#DEEBFF", "#0052CC", "#0052CC"
COL_TEXT_DARK = "#172B4D"

DAY_NAMES_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
DAY_NAMES_KN = ["ಭಾನು", "ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"]
MONTH_NAMES_EN = ["", "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY",
                  "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
MONTH_NAMES_KN = ["", "ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ",
                  "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"]


def build_chart(lang, out_path):
    is_kn = (lang == "kn")
    fp_reg  = FontProperties(family=["Noto Sans Kannada", "DejaVu Sans"])
    fp_bold = FontProperties(family=["Noto Sans Kannada", "DejaVu Sans"], weight="bold")

    day_names  = DAY_NAMES_KN if is_kn else DAY_NAMES_EN
    month_name = MONTH_NAMES_KN[MONTH] if is_kn else MONTH_NAMES_EN[MONTH]

    if is_kn:
        header_line1 = f"SKCP_ಕಾರ್ಮಿಕ ಹೆಸರು({LABOUR_NAME_KN})_ಸಂಬಳ"
        present_lbl, holiday_lbl, total_lbl = "ಹಾಜರು", "ಕಾರ್ಖಾನೆ ರಜೆ", "ಒಟ್ಟು"
        absent_lbl = "ಗೈರು"
        rupee = "₹"
        wage_note = f"ದಿನದ ಕೂಲಿ: {rupee}{DAILY_WAGE}   |   ಭಾನುವಾರ = ಕಾರ್ಖಾನೆ ರಜೆ"
        legend_items = [
            (COL_PRESENT_BG, COL_PRESENT_BR, "ಹಾಜರು"),
            (COL_ABSENT_BG,  COL_ABSENT_BR,  "ಗೈರು"),
            (COL_HOLIDAY_BG, COL_HOLIDAY_BR, "ರಜೆ"),
            (COL_TOTAL_BG,   COL_TOTAL_BR,   "ವಾರದ ಒಟ್ಟು"),
        ]
    else:
        header_line1 = f"SKCP_Labour Name({LABOUR_NAME_EN})_Salary"
        present_lbl, holiday_lbl, total_lbl = "Present", "Factory Holiday", "Total"
        absent_lbl = "Absent"
        rupee = "Rs."
        wage_note = f"Daily Wage: {rupee}{DAILY_WAGE}   |   Sunday = Factory Holiday"
        legend_items = [
            (COL_PRESENT_BG, COL_PRESENT_BR, "Present"),
            (COL_ABSENT_BG,  COL_ABSENT_BR,  "Absent"),
            (COL_HOLIDAY_BG, COL_HOLIDAY_BR, "Holiday"),
            (COL_TOTAL_BG,   COL_TOTAL_BR,   "Weekly Total"),
        ]

    cal = calendar.Calendar(firstweekday=6)  # weeks start Sunday
    weeks = cal.monthdayscalendar(YEAR, MONTH)
    n_rows = len(weeks)

    fig_w, fig_h = 12.5, 2.0 + n_rows * 1.55 + 1.4
    fig = plt.figure(figsize=(fig_w, fig_h), dpi=170)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, fig_w)
    ax.set_ylim(0, fig_h)
    ax.axis("off")
    ax.invert_yaxis()
    fig.patch.set_facecolor("white")

    margin_x = 0.45
    grid_top = 1.85
    cell_w = (fig_w - 2 * margin_x) / 7
    day_header_h = 0.55
    cell_h = 1.55

    header_h = 1.15
    ax.add_patch(FancyBboxPatch((margin_x, 0.15), fig_w - 2 * margin_x, header_h,
                                 boxstyle="round,pad=0.02,rounding_size=0.08",
                                 linewidth=0, facecolor=COL_HEADER_BG, zorder=2))
    ax.text(fig_w / 2, 0.15 + header_h * 0.36, header_line1, ha="center", va="center",
            fontproperties=fp_bold, fontsize=20, color=COL_HEADER_TEXT, zorder=3)
    ax.text(fig_w / 2, 0.15 + header_h * 0.74, f"{month_name} {YEAR}", ha="center", va="center",
            fontproperties=fp_bold, fontsize=15, color="#B3D4FF", zorder=3)

    y0 = grid_top
    for i, dname in enumerate(day_names):
        x0 = margin_x + i * cell_w
        ax.add_patch(FancyBboxPatch((x0, y0), cell_w - 0.05, day_header_h,
                                     boxstyle="round,pad=0.01,rounding_size=0.04",
                                     linewidth=0, facecolor=COL_DAYROW_BG, zorder=2))
        col = "#FFC400" if i == 0 else "#FFFFFF"
        ax.text(x0 + cell_w / 2, y0 + day_header_h / 2, dname, ha="center", va="center",
                fontproperties=fp_bold, fontsize=13, color=col, zorder=3)

    grid_body_top = y0 + day_header_h + 0.08

    for r, week in enumerate(weeks):
        row_y = grid_body_top + r * (cell_h + 0.08)

        # weekly total: count present days (Mon..Sat, in-month, not absent)
        present_count = 0
        for idx, d in enumerate(week):
            if d != 0 and idx != 0 and d not in ABSENT_DATES:
                present_count += 1
        weekly_total = present_count * DAILY_WAGE
        total_cell_idx = 6 if week[6] != 0 else next(
            (i for i in range(6, -1, -1) if week[i] != 0), None)

        for c, d in enumerate(week):
            x0 = margin_x + c * cell_w
            is_sunday = (c == 0)

            if d == 0:
                bg, br, tx = COL_OUTMONTH_BG, COL_OUTMONTH_BR, COL_OUTMONTH_TX
            elif is_sunday:
                bg, br, tx = COL_HOLIDAY_BG, COL_HOLIDAY_BR, COL_HOLIDAY_TX
            elif d in ABSENT_DATES:
                bg, br, tx = COL_ABSENT_BG, COL_ABSENT_BR, COL_ABSENT_TX
            else:
                bg, br, tx = COL_PRESENT_BG, COL_PRESENT_BR, COL_PRESENT_TX

            ax.add_patch(FancyBboxPatch((x0, row_y), cell_w - 0.05, cell_h,
                                         boxstyle="round,pad=0.01,rounding_size=0.05",
                                         linewidth=1.4, edgecolor=br, facecolor=bg, zorder=2))
            if d == 0:
                continue

            ax.text(x0 + 0.14, row_y + 0.32, str(d), ha="left", va="center",
                    fontproperties=fp_bold, fontsize=19, color=tx, zorder=3)

            if is_sunday:
                label, amount = holiday_lbl, f"{rupee}0"
            elif d in ABSENT_DATES:
                label, amount = absent_lbl, f"{rupee}0"
            else:
                label, amount = present_lbl, f"{rupee}{DAILY_WAGE}"

            ax.text(x0 + cell_w / 2 - 0.05, row_y + 0.95, label, ha="center", va="center",
                    fontproperties=fp_bold, fontsize=11.5, color=tx, zorder=3)
            ax.text(x0 + cell_w / 2 - 0.05, row_y + 1.28, amount, ha="center", va="center",
                    fontproperties=fp_reg, fontsize=12.5, color=tx, zorder=3)

            if total_cell_idx is not None and c == total_cell_idx:
                badge_h = 0.34
                badge_y = row_y + cell_h - badge_h - 0.06
                ax.add_patch(FancyBboxPatch((x0 + 0.06, badge_y), cell_w - 0.17, badge_h,
                                             boxstyle="round,pad=0.008,rounding_size=0.05",
                                             linewidth=1.1, edgecolor=COL_TOTAL_BR,
                                             facecolor=COL_TOTAL_BG, zorder=4))
                ax.text(x0 + cell_w / 2 - 0.05, badge_y + badge_h / 2,
                        f"{total_lbl}: {rupee}{weekly_total}", ha="center", va="center",
                        fontproperties=fp_bold, fontsize=10.3, color=COL_TOTAL_TX, zorder=5)

    footer_y = grid_body_top + n_rows * (cell_h + 0.08) + 0.12
    ax.text(margin_x + 0.05, footer_y + 0.18, wage_note, ha="left", va="center",
            fontproperties=fp_reg, fontsize=12, color=COL_TEXT_DARK)

    lx, ly = margin_x + 0.05, footer_y + 0.58
    for bg, br, label in legend_items:
        ax.add_patch(FancyBboxPatch((lx, ly - 0.11), 0.28, 0.22,
                                     boxstyle="round,pad=0.01,rounding_size=0.03",
                                     linewidth=1.1, edgecolor=br, facecolor=bg, zorder=3))
        ax.text(lx + 0.36, ly, label, ha="left", va="center", fontproperties=fp_reg,
                fontsize=10.8, color=COL_TEXT_DARK, zorder=3)
        lx += 0.36 + len(label) * 0.082 + 0.55

    fig.savefig(out_path, facecolor="white")
    plt.close(fig)
    print(f"Saved: {out_path}")


def main():
    global LABOUR_NAME_EN, LABOUR_NAME_KN, YEAR, MONTH, DAILY_WAGE, ABSENT_DATES

    parser = argparse.ArgumentParser(description="Generate SKCP labour salary chart(s).")
    parser.add_argument("--name-en", default=LABOUR_NAME_EN)
    parser.add_argument("--name-kn", default=LABOUR_NAME_KN)
    parser.add_argument("--year", type=int, default=YEAR)
    parser.add_argument("--month", type=int, default=MONTH)
    parser.add_argument("--wage", type=int, default=DAILY_WAGE)
    parser.add_argument("--absent", default="", help="comma-separated day numbers, e.g. 10,17,24")
    args = parser.parse_args()

    LABOUR_NAME_EN = args.name_en
    LABOUR_NAME_KN = args.name_kn
    YEAR = args.year
    MONTH = args.month
    DAILY_WAGE = args.wage
    ABSENT_DATES = [int(x) for x in args.absent.split(",") if x.strip()]

    safe_name = LABOUR_NAME_EN.replace(" ", "_")
    for lang in LANGUAGES_TO_GENERATE:
        out_path = os.path.join(
            OUTPUT_DIR, f"SKCP_{safe_name}_Salary_{MONTH:02d}_{YEAR}_{lang}.png"
        )
        build_chart(lang, out_path)


if __name__ == "__main__":
    main()
